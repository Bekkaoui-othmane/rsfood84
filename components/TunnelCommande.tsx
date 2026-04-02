'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Ajout de useSession pour la vérification
import { z } from 'zod'; // Ajout de Zod pour la validation stricte
import { usePanierStore } from '@/store/panierStore';
import { ShoppingBag, X, CheckCircle2, ChevronRight, ChevronLeft, Package, Plus, Minus } from 'lucide-react';
import { 
  BOISSONS, 
  SAUCES, 
  OPTIONS_GRATINAGE,
  VIANDES_TACOS 
} from '@/lib/mockData';

// --- SCHÉMAS ZOD POUR SÉCURISER LES ENTRÉES ---
// Validation du produit entrant pour éviter toute injection ou corruption des données
const produitSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  prixBase: z.number().min(0, "Le prix ne peut pas être négatif"),
  categorie: z.enum(['burger', 'tacos', 'poutine', 'formule']),
  ingredientsDemontables: z.array(z.string()).optional(),
  description: z.string().optional(),
});

type ProduitValide = z.infer<typeof produitSchema>;

// Définitions des props avec le type validé
type Props = {
  produit: ProduitValide;
  onFermer: () => void;
};

// --- TYPES ---
export type ChoixGratinage = typeof OPTIONS_GRATINAGE[number];

export type ConfigCommande = {
  avecFritesBoisson: boolean;
  gratinage: ChoixGratinage | null;
  fritesFromage: boolean;
  sauce: string | null;
  boisson1: string | null;
  boisson2: string | null;
  ingredientsRetires: string[];
  nbViandes: number | null;
  viandes: string[];
  taillePoutine: 'L' | 'XL' | null;
  burgersFormule: { nomBurger: string, ingredientsRetires: string[], gratinage: string | null }[];
};

export default function TunnelCommande({ produit, onFermer }: Props) {
  // --- VÉRIFICATION DE SESSION NEXTAUTH ---
  // Ajout de la protection de route/composant
  const { status } = useSession();
  
  // Validation Zod de la prop 'produit' via un parse strict
  // Va lever une erreur si la donnée a été compromise volontairement (injection des query params ou state)
  const safeProduit = useMemo(() => {
    try {
      return produitSchema.parse(produit);
    } catch (e) {
      console.error("Données produit corrompues:", e);
      return null;
    }
  }, [produit]);

  const router = useRouter();
  
  // Remplacement des @ts-ignore par des assertions de type sécurisées
  const store = usePanierStore() as unknown as { ajouterArticle: (item: unknown) => void, ouvrirPanier: () => void };
  const ajouterArticle = store.ajouterArticle || (() => {});
  const ouvrirPanier = store.ouvrirPanier || (() => {});

  const [etapeCourante, setEtapeCourante] = useState(0);

  const getNbViandes = () => {
    if (!safeProduit) return null;
    if (safeProduit.categorie !== 'tacos') return null;
    if (safeProduit.nom.includes('1')) return 1;
    if (safeProduit.nom.includes('2')) return 2;
    if (safeProduit.nom.includes('3')) return 3;
    return null;
  };

  const getBurgersFormule = () => {
    if (!safeProduit || safeProduit.categorie !== 'formule' || !safeProduit.description) return [];
    return safeProduit.description.split('+').map((s: string) => s.trim()).filter((s: string) => s.toLowerCase() !== 'frites' && s.toLowerCase() !== 'boisson').map((nom: string) => ({
      nomBurger: nom,
      ingredientsRetires: [],
      gratinage: null
    }));
  };

  const [config, setConfig] = useState<ConfigCommande>({
    avecFritesBoisson: false,
    gratinage: null,
    fritesFromage: false,
    sauce: null,
    boisson1: null,
    boisson2: null,
    ingredientsRetires: safeProduit?.categorie === 'tacos'
      ? ['Salade', 'Tomate', 'Oignon']
      : [],
    nbViandes: getNbViandes(),
    viandes: [],
    taillePoutine: null,
    burgersFormule: getBurgersFormule()
  });

  // --- DÉFINITION DES ÉTAPES PAR CATÉGORIE ---
  const etapesBurger = [
    'Frites + Boisson ?',
    'Retirer Ingrédients',
    'Gratiné ?',
    'Frites Cheddar Bacon ?',
    'Sauce',
    'Boisson',
    '2ème boisson ?',
    'Récapitulatif'
  ];

  const etapesTacos = [
    'Retirer Ingrédients',
    'Choisir les viandes',
    'Gratiné ?',
    'Frites Cheddar Bacon ?',
    'Sauce',
    'Boisson',
    '2ème boisson ?',
    'Récapitulatif'
  ];

  const etapesPoutine = [
    'Taille',
    'Sauce',
    'Boisson',
    'Récapitulatif'
  ];

  const etapesFormule = [
    'Personnaliser les burgers',
    'Sauce',
    'Boisson incluse',
    '2ème boisson ?',
    'Récapitulatif'
  ];

  const getEtapes = () => {
    if (!safeProduit) return etapesBurger;
    switch (safeProduit.categorie) {
      case 'burger': return etapesBurger;
      case 'tacos': return etapesTacos;
      case 'poutine': return etapesPoutine;
      case 'formule': return etapesFormule;
      default: return etapesBurger;
    }
  };

  const etapes = getEtapes();
  const nomEtapeCourante = etapes[etapeCourante];

  // --- CALCUL DU PRIX TOTAL ---
  const prixTotal = useMemo(() => {
    if (!safeProduit) return 0;
    let total = safeProduit.prixBase;

    // Supplement menu burger
    if (safeProduit.categorie === 'burger' && config.avecFritesBoisson) total += 2;
    
    // Tacos viandes
    if (safeProduit.categorie === 'tacos') {
      if (config.nbViandes === 1) total = 8;
      if (config.nbViandes === 2) total = 9;
      if (config.nbViandes === 3) total = 10;
      // Supplement Tenders et autres viandes payantes
      total += config.viandes.reduce((acc, vName) => {
        const viande = VIANDES_TACOS.find(v => v.nom === vName);
        return acc + (viande?.prix || 0);
      }, 0);
    }

    // Poutine taille
    if (safeProduit.categorie === 'poutine') {
      if (config.taillePoutine === 'XL') total += 2; // L=9, XL=11
    }

    // Gratinage
    if (config.gratinage) total += 2;

    // Frites fromage
    if (config.fritesFromage) total += 2;

    // Boissons
    if (safeProduit.categorie === 'burger') {
      if (config.avecFritesBoisson) total += 2;
      if (!config.avecFritesBoisson && config.boisson1) total += 2;
      if (config.boisson2) total += 2;
    } else {
      if (safeProduit.categorie === 'tacos' && config.boisson1) total += BOISSONS.find(b => b.nom === config.boisson1)?.prix || 0;
      if (safeProduit.categorie === 'poutine' && config.boisson1) total += BOISSONS.find(b => b.nom === config.boisson1)?.prix || 0;
      if (config.boisson2) total += BOISSONS.find(b => b.nom === config.boisson2)?.prix || 0;
    }

    // Formules
    if (safeProduit.categorie === 'formule') {
      config.burgersFormule.forEach(b => {
        if (b.gratinage) total += 2;
      });
    }

    return total;
  }, [
    safeProduit,
    config.avecFritesBoisson,
    config.gratinage,
    config.fritesFromage,
    config.boisson1,
    config.boisson2,
    config.nbViandes,
    config.viandes,
    config.taillePoutine,
    config.burgersFormule,
  ]);

  const gererSuivant = () => {
    if (etapeCourante < etapes.length - 1) {
      setEtapeCourante(prev => prev + 1);
    }
  };

  const gererRetour = () => {
    if (etapeCourante > 0) {
      setEtapeCourante(prev => prev - 1);
    } else {
      onFermer();
    }
  };

  const validerPanier = () => {
    ajouterArticle({
      id: Date.now().toString(),
      produitId: safeProduit.id,
      nom: safeProduit.nom,
      prix: prixTotal,
      quantite: 1,
      config: config,
      personnalisations: [
        ...config.ingredientsRetires.map(ing => ({ 
          nom: ing, prix: 0, type: 'retrait' as const 
        })),
        ...config.viandes
          .filter((v: string) => (VIANDES_TACOS.find(vt => vt.nom === v)?.prix || 0) > 0)
          .map((v: string) => ({ 
            nom: v, 
            prix: VIANDES_TACOS.find(vt => vt.nom === v)?.prix || 0, 
            type: 'ajout' as const 
          })),
        ...(config.gratinage ? [{ 
          nom: 'Gratiné ' + config.gratinage, prix: 2, type: 'ajout' as const 
        }] : []),
        ...(config.fritesFromage ? [{ 
          nom: 'Frites Cheddar Bacon', prix: 2, type: 'ajout' as const 
        }] : []),
        ...(config.sauce ? [{ 
          nom: 'Sauce ' + config.sauce, prix: 0, type: 'ajout' as const 
        }] : []),
        ...(config.boisson1 ? [{ 
          nom: config.boisson1, 
          prix: ((safeProduit.categorie === 'burger' && config.avecFritesBoisson) || safeProduit.categorie === 'formule') ? 0 : (BOISSONS.find(b => b.nom === config.boisson1)?.prix || 0), 
          type: 'ajout' as const 
        }] : []),
        ...(config.boisson2 ? [{ 
          nom: config.boisson2, 
          prix: BOISSONS.find(b => b.nom === config.boisson2)?.prix || 0, 
          type: 'ajout' as const 
        }] : []),
      ]
    });
    onFermer();
    ouvrirPanier();
    router.push('/menu');
  };

  const majConfig = <K extends keyof ConfigCommande>(key: K, value: ConfigCommande[K], autoNext = false) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (autoNext) {
      setTimeout(gererSuivant, 200);
    }
  };

  // --- NOUVEAU RENDU DES ÉTAPES ---
  const renderContenu = () => {
    switch (nomEtapeCourante) {
      case 'Frites + Boisson ?':
        return (
          <div className="flex flex-col gap-4">
            <button onClick={() => majConfig('avecFritesBoisson', false, true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${!config.avecFritesBoisson ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-white text-lg font-semibold font-[family-name:var(--font-outfit)] block mb-1">Seul</span>
                  <span className="text-[var(--text-secondary)] text-sm">Pas de frites, pas de boisson</span>
                </div>
                {!config.avecFritesBoisson && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
              </div>
            </button>
            
            <button onClick={() => majConfig('avecFritesBoisson', true, true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.avecFritesBoisson ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-white text-lg font-semibold font-[family-name:var(--font-outfit)] block mb-1">Menu (+2.00€)</span>
                  <span className="text-[var(--text-secondary)] text-sm">Inclus des frites classiques et une boisson</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--orange)] font-bold text-lg">+2.00€</span>
                  {config.avecFritesBoisson && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
                </div>
              </div>
            </button>
          </div>
        );

      case 'Retirer Ingrédients':
        const fallbackIngredients: Record<string, string[]> = {
          burger: ['Salade', 'Tomate', 'Oignon', 'Cornichon', 'Cheddar', 'Sauce'],
          tacos: ['Salade', 'Tomate', 'Oignon', 'Sauce blanche', 'Frites'],
          sandwich: ['Salade', 'Tomate', 'Oignon'],
          poutine: [],
          formule: [],
        };

        const ingredientsAfficher =
          (safeProduit.ingredientsDemontables && safeProduit.ingredientsDemontables.length > 0)
            ? safeProduit.ingredientsDemontables
            : (fallbackIngredients[safeProduit.categorie] ?? []);

        if (ingredientsAfficher.length === 0) {
          // Passer automatiquement si pas d'ingrédients
          gererSuivant();
          return null;
        }

        return (
          <div className="flex flex-wrap gap-3">
            {ingredientsAfficher.map(ing => {
               const isRemoved = config.ingredientsRetires.includes(ing);
               return (
                 <button
                   key={ing}
                   onClick={() => {
                     setConfig(prev => ({
                       ...prev,
                       ingredientsRetires: isRemoved 
                         ? prev.ingredientsRetires.filter(i => i !== ing)
                         : [...prev.ingredientsRetires, ing]
                     }));
                   }}
                   className={`px-5 py-3 rounded-full flex items-center gap-2 transition-all ${
                     isRemoved 
                       ? 'bg-red-500/15 text-red-400 border border-red-500/40' 
                       : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-gray-500'
                   }`}
                 >
                   {isRemoved && <X size={16} className="shrink-0" />}
                   <span className="font-medium text-sm font-[family-name:var(--font-inter)]">
                     {isRemoved ? `Sans ${ing.toLowerCase()}` : ing}
                   </span>
                 </button>
               );
             })}
          </div>
        );

      case 'Gratiné ?':
      case 'Gratiné supplémentaire ?':
        const optionsGratinage = safeProduit.categorie === 'burger'
          ? ['Mozza-Emmental', 'Boursin', 'Chèvre Miel', 'Raclette']
          : OPTIONS_GRATINAGE;
        return (
          <div className="flex flex-col gap-4">
            <button onClick={() => majConfig('gratinage', null, true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.gratinage === null ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-lg font-semibold font-[family-name:var(--font-outfit)] block">Non merci</span>
                </div>
                {config.gratinage === null && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
              </div>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionsGratinage.map(opt => (
                <button
                  key={opt}
                  onClick={() => majConfig('gratinage', opt as ChoixGratinage, true)}
                  className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.gratinage === opt ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}
                >
                  <div className="flex flex-col h-full justify-center">
                    <span className="text-white text-lg font-semibold font-[family-name:var(--font-outfit)] block">{opt}</span>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[var(--text-secondary)] text-sm">Gratinage +2.00€</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--orange)] font-bold">+2.00€</span>
                        {config.gratinage === opt && <CheckCircle2 className="text-[var(--orange)] w-5 h-5 shrink-0" />}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'Frites Cheddar Bacon ?':
         return (
           <div className="flex flex-col gap-4">
             <button onClick={() => majConfig('fritesFromage', false, true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${!config.fritesFromage ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
               <div className="flex items-center justify-between">
                 <div>
                   <span className="text-white text-lg font-semibold font-[family-name:var(--font-outfit)] block">Classiques</span>
                   <span className="text-[var(--text-secondary)] text-sm mt-1 block">Frites natures incluses</span>
                 </div>
                 {!config.fritesFromage && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
               </div>
             </button>
             <button onClick={() => majConfig('fritesFromage', true, true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.fritesFromage ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
               <div className="flex items-center justify-between">
                 <div>
                   <span className="text-white text-lg font-semibold font-[family-name:var(--font-outfit)] block">Cheddar & Bacon</span>
                   <span className="text-[var(--text-secondary)] text-sm mt-1 block">Supplément gourmand</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-[var(--orange)] font-bold text-lg">+2.00€</span>
                   {config.fritesFromage && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
                 </div>
               </div>
             </button>
           </div>
         );

      case 'Sauce':
        const optionsSauce = safeProduit.categorie === 'burger'
          ? ['Algérienne', 'Curry', 'Blanche', 'Andalouse', 'Bigi Burger', 'Mayo', 'Ketchup', 'Barbecue']
          : SAUCES;
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             <button onClick={() => majConfig('sauce', null, true)} className={`flex items-center justify-center p-4 min-h-[64px] rounded-xl text-center transition-all ${config.sauce === null ? 'bg-[var(--orange)] text-white font-bold shadow-[0_0_15px_rgba(232,93,4,0.4)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium hover:bg-[#2A2A2A] hover:text-white'}`}>
                Sans sauce
             </button>
             {optionsSauce.map(s => (
               <button key={s} onClick={() => majConfig('sauce', s, true)} className={`flex items-center justify-center p-4 min-h-[64px] rounded-xl text-center transition-all ${config.sauce === s ? 'bg-[var(--orange)] text-white font-bold shadow-[0_0_15px_rgba(232,93,4,0.4)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-medium hover:bg-[#2A2A2A] hover:text-white'}`}>
                 {s}
               </button>
             ))}
          </div>
        );

      case 'Boisson':
      case 'Boisson incluse':
      case '2ème boisson ?':
        const isBoisson2 = nomEtapeCourante === '2ème boisson ?';
        const isGratuite =
          !isBoisson2 &&
          ((safeProduit.categorie === 'burger' && config.avecFritesBoisson === true) ||
            nomEtapeCourante === 'Boisson incluse');
        const bKey = isBoisson2 ? 'boisson2' : 'boisson1';
        
        return (
          <div className="flex flex-col gap-3">
            <button onClick={() => majConfig(bKey, null, true)} className={`group relative p-4 rounded-xl border text-left transition-all ${config[bKey] === null ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
                   <Minus size={20} />
                </div>
                <span className="text-white font-semibold font-[family-name:var(--font-outfit)] flex-1">{isBoisson2 ? 'Pas de 2ème boisson' : 'Sans boisson'}</span>
                {config[bKey] === null && <CheckCircle2 className="text-[var(--orange)] w-5 h-5 shrink-0" />}
              </div>
            </button>
            {BOISSONS.map(b => (
               <button key={b.nom} onClick={() => majConfig(bKey, b.nom, true)} className={`group relative p-4 rounded-xl border text-left transition-all ${config[bKey] === b.nom ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
                 <div className="flex items-center gap-4">
                   <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--orange)] overflow-hidden">
                     {b.image ? <img src={b.image} alt={b.nom} className="w-full h-full object-cover" /> : <Package size={20} />}
                   </div>
                   <div className="flex-1">
                     <span className="text-white font-semibold font-[family-name:var(--font-outfit)] block">{b.nom}</span>
                     <span className="text-[var(--text-secondary)] text-sm">Rafraîchissante (33cl)</span>
                   </div>
                   <div className="flex items-center gap-3">
                     {isGratuite
                        ? <span className="text-green-400 font-bold text-sm">Incluse ✓</span>
                        : <span className="text-[var(--orange)] font-bold">+{b.prix.toFixed(2)}€</span>
                     }
                     {config[bKey] === b.nom && <CheckCircle2 className="text-[var(--orange)] w-5 h-5 shrink-0" />}
                   </div>
                 </div>
               </button>
            ))}
          </div>
        );

      case 'Nombre de viandes':
        return (
          <div className="grid gap-4">
            {[1, 2, 3].map(n => (
              <button key={n} onClick={() => majConfig('nbViandes', n, true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.nbViandes === n ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-white text-xl font-bold font-[family-name:var(--font-outfit)]">{n} Viande{n > 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--orange)] font-bold text-xl">{n === 1 ? '8.00€' : n === 2 ? '9.00€' : '10.00€'}</span>
                    {config.nbViandes === n && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'Choisir les viandes':
         if (!config.nbViandes) return null;
         return (
           <div className="flex flex-col gap-3">
              {VIANDES_TACOS.map(vObj => {
                const v = vObj.nom;
                const count = config.viandes.filter(x => x === v).length;
                const isTenders = vObj.prix > 0;
                const totalM = config.viandes.length;
                const canAdd = totalM < config.nbViandes!;
                const canRemove = count > 0;
                
                return (
                  <div key={v} className={`group relative p-4 rounded-2xl border flex items-center justify-between transition-all ${count > 0 ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)]'}`}>
                    <div className="flex flex-col">
                      <span className={`text-lg font-semibold font-[family-name:var(--font-outfit)] ${isTenders ? 'text-[var(--orange)]' : 'text-white'}`}>
                        {v}
                      </span>
                      {isTenders && (
                        <span className="text-[var(--orange)] text-xs font-bold mt-1">
                          +{vObj.prix.toFixed(2)}€ / portion
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          if (canRemove) {
                            const index = config.viandes.indexOf(v);
                            const newV = [...config.viandes];
                            if (index > -1) newV.splice(index, 1);
                            setConfig(prev => ({ ...prev, viandes: newV }));
                          }
                        }}
                        disabled={!canRemove}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all ${canRemove ? 'bg-[var(--bg-secondary)] text-white hover:bg-[#444]' : 'bg-transparent text-transparent'}`}
                      >
                         -
                      </button>
                      <span className="text-white font-semibold w-4 text-center">{count > 0 ? count : ''}</span>
                      <button 
                        onClick={() => {
                          if (canAdd) {
                            const newV = [...config.viandes, v];
                            setConfig(prev => ({ ...prev, viandes: newV }));
                            if (newV.length === config.nbViandes) {
                              setTimeout(gererSuivant, 500); // Auto next when all selected
                            }
                          }
                        }}
                        disabled={!canAdd}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all ${canAdd ? 'bg-[var(--orange)] text-white hover:bg-[var(--orange-hover)] shadow-md' : 'bg-[#1A1A1A] text-gray-600'}`}
                      >
                         +
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Footer compteur */}
              <div className="mt-6 flex justify-center">
                 <div className="bg-[var(--bg-secondary)] text-white px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2">
                    <span className="text-[var(--orange)] font-bold">{config.viandes.length}</span> 
                    / <span className="font-bold">{config.nbViandes}</span> viandes choisies
                 </div>
              </div>
           </div>
         );

      case 'Taille':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => majConfig('taillePoutine', 'L', true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.taillePoutine === 'L' ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-xl font-bold font-[family-name:var(--font-outfit)] block mb-1">Taille L</span>
                  <span className="text-[var(--text-secondary)] text-sm">Généreuse</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--orange)] font-bold text-xl">9.00€</span>
                  {config.taillePoutine === 'L' && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
                </div>
              </div>
            </button>
            <button onClick={() => majConfig('taillePoutine', 'XL', true)} className={`group relative p-6 min-h-[88px] rounded-2xl border text-left transition-all ${config.taillePoutine === 'XL' ? 'border-[var(--orange)] bg-[var(--orange)]/10' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[#444] hover:bg-[#161616]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-xl font-bold font-[family-name:var(--font-outfit)] block mb-1">Taille XL</span>
                  <span className="text-[var(--text-secondary)] text-sm">Pour les grands appétits</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[var(--orange)] font-bold text-xl">11.00€</span>
                  {config.taillePoutine === 'XL' && <CheckCircle2 className="text-[var(--orange)] w-6 h-6 shrink-0" />}
                </div>
              </div>
            </button>
          </div>
        );

      case 'Personnaliser les burgers':
        return (
          <div className="flex flex-col gap-8">
            {config.burgersFormule.map((burger, index) => {
              const baseIngredients = safeProduit.categorie === 'formule' 
                 ? ['Salade', 'Tomate', 'Oignon', 'Cornichon', 'Cheddar', 'Sauce'] 
                 : [];
              const optionsGratinage = ['Mozza-Emmental', 'Boursin', 'Chèvre Miel', 'Raclette'];
              
              return (
                <div key={index} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                   <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] text-[var(--orange)] mb-4 pb-2 border-b border-[#333]">
                     {burger.nomBurger}
                   </h3>
                   
                   {/* Ingrédients */}
                   <div className="mb-6">
                     <span className="text-[var(--text-secondary)] text-sm mb-3 block">Ingrédients à retirer :</span>
                     <div className="flex flex-wrap gap-2">
                       {baseIngredients.map(ing => {
                         const isRemoved = burger.ingredientsRetires.includes(ing);
                         return (
                           <button
                             key={ing}
                             onClick={() => {
                               const newBurgers = [...config.burgersFormule];
                               if (isRemoved) {
                                 newBurgers[index].ingredientsRetires = newBurgers[index].ingredientsRetires.filter(i => i !== ing);
                               } else {
                                 newBurgers[index].ingredientsRetires.push(ing);
                               }
                               setConfig(prev => ({ ...prev, burgersFormule: newBurgers }));
                             }}
                             className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all text-xs font-medium ${
                               isRemoved 
                                 ? 'bg-red-500/15 text-red-500 border border-red-500/40' 
                                 : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-gray-500'
                             }`}
                           >
                             {isRemoved && <X size={14} className="shrink-0" />}
                             <span>{isRemoved ? `Sans ${ing.toLowerCase()}` : ing}</span>
                           </button>
                         );
                       })}
                     </div>
                   </div>

                   {/* Gratinage */}
                   <div>
                     <span className="text-[var(--text-secondary)] text-sm mb-3 block">Gratinage (+2.00€) :</span>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                       <button
                         onClick={() => {
                           const newBurgers = [...config.burgersFormule];
                           newBurgers[index].gratinage = null;
                           setConfig(prev => ({ ...prev, burgersFormule: newBurgers }));
                         }}
                         className={`p-3 text-sm text-center rounded-xl border transition-all ${burger.gratinage === null ? 'border-[var(--orange)] bg-[var(--orange)] text-white font-bold' : 'border-[#333] hover:border-[#555] text-gray-400'}`}
                       >
                         Non merci
                       </button>
                       {optionsGratinage.map(opt => (
                         <button
                           key={opt}
                           onClick={() => {
                             const newBurgers = [...config.burgersFormule];
                             newBurgers[index].gratinage = opt;
                             setConfig(prev => ({ ...prev, burgersFormule: newBurgers }));
                           }}
                           className={`p-2 text-xs md:text-sm text-center rounded-xl border transition-all ${burger.gratinage === opt ? 'border-[var(--orange)] bg-[var(--orange)]/10 text-[var(--orange)] font-bold' : 'border-[#333] hover:border-[#555] text-gray-400'}`}
                         >
                           {opt}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
        );

      case 'Récapitulatif':
        return (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 max-w-lg mx-auto w-full">
            <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">
              Votre commande
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-[var(--border-color)]">
                <span className="text-white font-semibold text-lg">{safeProduit.nom}</span>
                <span className="text-[var(--text-secondary)]">{safeProduit.prixBase.toFixed(2)}€</span>
              </div>

              {safeProduit.categorie === 'burger' && config.avecFritesBoisson && (
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Plus size={16} className="text-green-500 shrink-0" />
                    <span className="text-gray-300 text-sm">Menu (Frites + Boisson)</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">+2.00€</span>
                </div>
              )}

              {safeProduit.categorie === 'tacos' && config.nbViandes && (
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Plus size={16} className="text-green-500 shrink-0" />
                    <span className="text-gray-300 text-sm">{config.nbViandes} Viande(s)</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">
                    {config.nbViandes === 1 ? '8.00€' : config.nbViandes === 2 ? '9.00€' : '10.00€'}
                  </span>
                </div>
              )}

              {config.viandes.map(v => {
                const count = config.viandes.filter(x => x === v).length;
                if (config.viandes.indexOf(v) !== config.viandes.lastIndexOf(v) && config.viandes.indexOf(v) !== -1) return null; // Avoid duplicates visually
                const viandeObj = VIANDES_TACOS.find(vi => vi.nom === v);
                return (
                  <div key={v} className="flex justify-between items-center pl-6">
                    <span className="text-[var(--text-secondary)] text-sm">• {count}x {v}</span>
                    {viandeObj && viandeObj.prix > 0 && (
                      <span className="text-green-500 text-sm font-semibold">+{(viandeObj.prix * count).toFixed(2)}€</span>
                    )}
                  </div>
                );
              })}

              {safeProduit.categorie === 'formule' && config.burgersFormule.map((b, idx) => (
                <div key={idx} className="border-t border-[var(--border-color)]/50 pt-3">
                  <span className="text-white font-semibold text-sm mb-2 block">{b.nomBurger}</span>
                  {b.ingredientsRetires.map(ing => (
                    <div key={ing} className="flex items-center gap-2 pl-4 mb-1">
                      <Minus size={14} className="text-red-500 shrink-0" />
                      <span className="text-red-400 text-xs">Sans {ing.toLowerCase()}</span>
                    </div>
                  ))}
                  {b.gratinage && (
                    <div className="flex justify-between items-center pl-4">
                      <div className="flex gap-2 items-center">
                        <Plus size={14} className="text-green-500 shrink-0" />
                        <span className="text-gray-300 text-xs">Gratiné {b.gratinage}</span>
                      </div>
                      <span className="text-green-500 text-xs font-semibold">+2.00€</span>
                    </div>
                  )}
                </div>
              ))}

              {safeProduit.categorie === 'poutine' && config.taillePoutine === 'XL' && (
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Plus size={16} className="text-green-500 shrink-0" />
                    <span className="text-gray-300 text-sm">Taille XL</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">+2.00€</span>
                </div>
              )}

              {config.ingredientsRetires.map(ing => (
                <div key={ing} className="flex items-center gap-2">
                  <Minus size={16} className="text-red-500 shrink-0" />
                  <span className="text-red-400 text-sm">Sans {ing.toLowerCase()}</span>
                </div>
              ))}

              {config.gratinage && (
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Plus size={16} className="text-green-500 shrink-0" />
                    <span className="text-gray-300 text-sm">Gratiné {config.gratinage}</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">+2.00€</span>
                </div>
              )}

              {config.fritesFromage && (
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Plus size={16} className="text-green-500 shrink-0" />
                    <span className="text-gray-300 text-sm">Frites Cheddar Bacon</span>
                  </div>
                  <span className="text-green-500 text-sm font-semibold">+2.00€</span>
                </div>
              )}

              {config.sauce && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500 shrink-0"></span>
                  <span className="text-[var(--text-secondary)] text-sm">
                    Sauce : <span className="text-gray-200">{config.sauce}</span>
                  </span>
                </div>
              )}

              {config.boisson1 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--orange)] shrink-0"></span>
                    <span className="text-[var(--text-secondary)] text-sm">
                      Boisson : <span className="text-gray-200">{config.boisson1}</span>
                    </span>
                  </div>
                  {safeProduit.categorie === 'burger' && config.avecFritesBoisson
                    ? <span className="text-green-500 text-sm font-semibold">Incluse ✓</span>
                    : <span className="text-[var(--orange)] text-sm font-semibold">+2.00€</span>
                  }
                </div>
              )}

              {config.boisson2 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--orange)] shrink-0"></span>
                    <span className="text-[var(--text-secondary)] text-sm">
                      2ème boisson : <span className="text-gray-200">{config.boisson2}</span>
                    </span>
                  </div>
                  <span className="text-[var(--orange)] text-sm font-semibold">+2.00€</span>
                </div>
              )}

              <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-baseline mt-2">
                <span className="text-[var(--text-secondary)] font-medium">Total</span>
                <span className="text-2xl font-bold text-[var(--orange)] font-[family-name:var(--font-outfit)]">
                  {prixTotal.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isReadyToSubmit = 
    nomEtapeCourante === 'Récapitulatif' && 
    (safeProduit.categorie !== 'tacos' || config.viandes.length === config.nbViandes) &&
    (safeProduit.categorie !== 'poutine' || config.taillePoutine !== null);

  const getSubTitleForStep = () => {
     if (nomEtapeCourante.includes('Boisson 2')) return "Envie d'une boisson supplémentaire ?";
     if (nomEtapeCourante.includes('Boisson')) return "Choisissez votre rafraîchissement.";
     if (nomEtapeCourante === 'Sauce') return "Une sauce offerte au choix.";
     if (nomEtapeCourante === 'Retirer Ingrédients') return "Sélectionnez les ingrédients que vous ne souhaitez pas.";
     if (nomEtapeCourante === 'Choisir les viandes') return `Sélectionnez exactement ${config.nbViandes || ''} viande(s).`;
     return "Personnalisez votre sélection selon vos envies.";
  };

  // Si pas de session, retourne explicitement une erreur 401
  if (status === 'unauthenticated') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-[family-name:var(--font-inter)]">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-8 rounded-2xl w-full max-w-md text-center">
          <X className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">401 Unauthorized</h2>
          <p className="text-sm">Vous n&apos;êtes pas autorisé à accéder à cette fonctionnalité. Veuillez vous connecter.</p>
          <button onClick={onFermer} className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">Fermer</button>
        </div>
      </div>
    );
  }

  // Protection finale : on ne rend rien si le validateur a échoué.
  if (!safeProduit) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 font-[family-name:var(--font-inter)]">
      {/* Conteneur principal de la modale */}
      <div className="relative w-full h-full max-w-7xl bg-[var(--bg-primary)] border border-[#333] rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Bouton de fermeture */}
        <button 
          onClick={onFermer} 
          className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[var(--border-color)] text-white flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
        >
          <X size={20} />
        </button>

        {/* --- COLONNE GAUCHE (Contenu intéractif) --- */}
        <div className="flex-1 flex flex-col pt-16 lg:pt-8 min-h-0 relative">
          <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-12 lg:py-8 w-full hide-scrollbar">
          
          {/* Header étape */}
          <div className="mb-10">
             <div className="text-[var(--orange)] font-bold text-sm tracking-wider uppercase mb-2">
                Étape {etapeCourante + 1} sur {etapes.length}
             </div>
             <h2 className="text-3xl lg:text-4xl font-bold text-white font-[family-name:var(--font-outfit)] mb-3">
               {nomEtapeCourante}
             </h2>
             <p className="text-[var(--text-secondary)]">
               {getSubTitleForStep()}
             </p>
          </div>

          {/* Wrapper d'étapes (Pills) */}
          <div className="flex items-center gap-1.5 mb-10 overflow-x-auto pb-4 hide-scrollbar">
            {etapes.map((_, index) => {
              const isPast = index <= etapeCourante;
              return (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${isPast ? 'bg-[var(--orange)] flex-[2]' : 'bg-[#222] flex-1'}`} 
                />
              );
            })}
          </div>

          {/* Formulaire dynamiques */}
          {renderContenu()}

        </div>

        {/* --- NAVIGATION BAS (Mobile & Desktop) --- */}
        {nomEtapeCourante !== 'Récapitulatif' && (
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--bg-primary)]/90 backdrop-blur-md border-t border-[var(--border-color)] p-5 px-6 lg:px-16 flex gap-4 lg:ml-20 max-w-3xl z-10 w-full">
            <button 
              onClick={gererRetour}
              className="flex-[0.3] flex items-center justify-center gap-2 py-4 bg-[var(--bg-secondary)] hover:bg-[#2A2A2A] text-white font-bold rounded-2xl transition-all"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Retour</span>
            </button>
            <button 
              onClick={gererSuivant}
              disabled={nomEtapeCourante === 'Choisir les viandes' && config.viandes.length !== config.nbViandes}
              className={`flex-[0.7] flex items-center justify-center gap-2 py-4 font-bold rounded-2xl transition-all ${
                (nomEtapeCourante === 'Choisir les viandes' && config.viandes.length !== config.nbViandes)
                ? 'bg-[#1A1A1A] text-gray-500 cursor-not-allowed'
                : 'bg-[var(--orange)] hover:bg-[var(--orange-hover)] shadow-[0_0_20px_rgba(232,93,4,0.2)] text-white'
              }`}
            >
              <span>Suivant</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* --- COLONNE DROITE (Récapitulatif fixe) --- */}
      <div className="hidden lg:flex w-[400px] xl:w-[450px] shrink-0 bg-[var(--bg-card)] border-l border-[var(--border-color)] p-8 flex-col h-full overflow-y-auto hide-scrollbar relative">
         
         <div className="relative w-full h-[180px] rounded-2xl bg-[#0F0F0F] border border-[var(--border-color)] overflow-hidden mb-8 flex items-center justify-center flex-shrink-0">
           {/* Placeholder img since 'safeProduit.image' might not be in the Produit type for the tunnel */}
           <div className="absolute inset-0 bg-gradient-to-br from-[var(--orange)]/20 to-transparent"></div>
           <ShoppingBag size={48} className="text-[var(--orange)]/50" />
         </div>

         <div className="flex-1">
           <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-1">{safeProduit.nom}</h3>
           <p className="text-[var(--text-secondary)] font-medium mb-8">Prix de base : {safeProduit.prixBase.toFixed(2)}€</p>

           <div className="space-y-4">
              
              {safeProduit.categorie === 'burger' && config.avecFritesBoisson && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <Plus size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Menu (Frites + Boisson)</span>
                  </div>
                  <span className="text-green-500 font-semibold whitespace-nowrap">+2.00€</span>
                </div>
              )}

              {safeProduit.categorie === 'tacos' && config.nbViandes && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <Plus size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Viandes (x{config.nbViandes})</span>
                  </div>
                  <span className="text-green-500 font-semibold whitespace-nowrap">+{(config.nbViandes === 2 ? 1 : config.nbViandes === 3 ? 2 : 0).toFixed(2)}€</span>
                </div>
              )}

              {config.viandes.length > 0 && config.viandes.map(v => {
                const viandeObj = VIANDES_TACOS.find(vi => vi.nom === v);
                const aUnPrix = viandeObj && viandeObj.prix > 0;
                return (
                  <div key={v} className="flex justify-between items-start">
                    <div className="flex gap-3 ml-7">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"></span>
                       <span className="text-[var(--text-secondary)] text-sm">{v}</span>
                    </div>
                    {aUnPrix && <span className="text-green-500 text-sm font-semibold whitespace-nowrap">+{viandeObj.prix.toFixed(2)}€</span>}
                  </div>
                );
              })}

              {safeProduit.categorie === 'poutine' && config.taillePoutine === 'XL' && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <Plus size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Taille XL</span>
                  </div>
                  <span className="text-green-500 font-semibold whitespace-nowrap">+2.00€</span>
                </div>
              )}

              {config.ingredientsRetires.map(ing => (
                <div key={ing} className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <Minus size={18} className="text-red-500 mt-0.5 shrink-0" />
                    <span className="text-red-400">Sans {ing.toLowerCase()}</span>
                  </div>
                </div>
              ))}

              {config.gratinage && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <Plus size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Gratiné {config.gratinage}</span>
                  </div>
                  <span className="text-green-500 font-semibold whitespace-nowrap">+2.00€</span>
                </div>
              )}

              {config.fritesFromage && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <Plus size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-300">Frites Cheddar Bacon</span>
                  </div>
                  <span className="text-green-500 font-semibold whitespace-nowrap">+2.00€</span>
                </div>
              )}

              {config.sauce && (
                <div className="flex items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-500 mt-2 shrink-0"></span>
                    <span className="text-[var(--text-secondary)]">Sauce: <span className="text-gray-200">{config.sauce}</span></span>
                  </div>
                </div>
              )}

              {config.boisson1 && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--orange)] mt-2 shrink-0"></span>
                    <span className="text-[var(--text-secondary)]">Boisson 1: <span className="text-gray-200">{config.boisson1}</span></span>
                  </div>
                  {config.avecFritesBoisson === true && safeProduit.categorie === 'burger' ? (
                    <span className="text-green-500 font-semibold whitespace-nowrap">Incluse</span>
                  ) : (
                    <span className="text-[var(--orange)] font-bold whitespace-nowrap">+{(safeProduit.categorie === 'burger' ? 2 : (BOISSONS.find(b => b.nom === config.boisson1)?.prix || 0)).toFixed(2)}€</span>
                  )}
                </div>
              )}

              {config.boisson2 && (
                <div className="flex justify-between items-start pt-3 border-t border-[var(--border-color)]/50">
                  <div className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--orange)] mt-2 shrink-0"></span>
                    <span className="text-[var(--text-secondary)]">Boisson 2: <span className="text-gray-200">{config.boisson2}</span></span>
                  </div>
                  <span className="text-[var(--orange)] font-bold whitespace-nowrap">+{(safeProduit.categorie === 'burger' ? 2 : (BOISSONS.find(b => b.nom === config.boisson2)?.prix || 0)).toFixed(2)}€</span>
                </div>
              )}

           </div>
         </div>

         <div className="mt-8 pt-8 border-t border-[var(--border-color)] flex-shrink-0 relative z-20">
           <div className="flex justify-between items-baseline mb-6">
             <span className="text-[var(--text-secondary)] font-medium text-lg">Total</span>
             <span className="text-3xl font-bold font-[family-name:var(--font-outfit)] text-[var(--orange)]">{prixTotal.toFixed(2)}€</span>
           </div>
           
           <button 
             onClick={isReadyToSubmit ? validerPanier : undefined}
             disabled={!isReadyToSubmit}
             className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
               isReadyToSubmit 
                  ? 'bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-bold shadow-[0_0_30px_rgba(232,93,4,0.25)]' 
                  : 'bg-[var(--orange)]/30 text-white/50 cursor-not-allowed font-medium'
             }`}
           >
             {isReadyToSubmit ? (
                <>
                  <ShoppingBag size={20} />
                  <span>Ajouter au panier</span>
                </>
             ) : (
                <span>Finalisez votre commande</span>
             )}
           </button>
         </div>

      </div>

      {/* --- RÉCAPITULATIF MOBILE (BottomSheet) --- */}
      {nomEtapeCourante === 'Récapitulatif' && (
         <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border-color)] p-6 z-20 rounded-t-3xl max-h-[80vh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">Votre Récapitulatif</h3>
            {/* Same list slightly compressed for mobile... we could reuse a component here but sticking to simple copy for exact DOM requests */}
            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
              <div className="flex justify-between items-start pb-3 border-b border-[var(--border-color)]/30">
                  <span className="text-gray-300 font-semibold">{safeProduit.nom}</span>
                  <span className="text-[var(--text-secondary)]">{safeProduit.prixBase.toFixed(2)}€</span>
              </div>
              
              {safeProduit.categorie === 'burger' && config.avecFritesBoisson && (
                <div className="flex justify-between items-start">
                  <div className="flex gap-2"><Plus size={16} className="text-green-500 shrink-0" /><span className="text-sm text-gray-400">Menu</span></div>
                  <span className="text-green-500 text-sm font-semibold">+2.00€</span>
                </div>
              )}
              {config.viandes.length > 0 && config.viandes.map(v => {
                const viandeObj = VIANDES_TACOS.find(vi => vi.nom === v);
                const aUnPrix = viandeObj && viandeObj.prix > 0;
                return (
                  <div key={v} className="flex justify-between items-start">
                    <div className="flex gap-2"><Plus size={16} className="text-green-500 shrink-0" /><span className="text-sm text-gray-400">{v}</span></div>
                    {aUnPrix && <span className="text-green-500 text-sm font-semibold">+{viandeObj.prix.toFixed(2)}€</span>}
                  </div>
                );
              })}
              {config.ingredientsRetires.map(ing => (
                <div key={ing} className="flex justify-between items-start">
                  <div className="flex gap-2"><Minus size={16} className="text-red-500 shrink-0" /><span className="text-sm text-red-400">Sans {ing.toLowerCase()}</span></div>
                </div>
              ))}
              {config.sauce && (
                <div className="flex items-start">
                  <div className="flex gap-2"><span className="text-[var(--text-secondary)] text-sm ml-5">Sauce: {config.sauce}</span></div>
                </div>
              )}
              {config.boisson1 && (
                <div className="flex justify-between items-start">
                  <div className="flex gap-2"><span className="text-[var(--text-secondary)] text-sm ml-5">Boisson 1: {config.boisson1}</span></div>
                  {config.avecFritesBoisson === true && safeProduit.categorie === 'burger' ? (
                    <span className="text-green-500 text-sm font-semibold">Incluse</span>
                  ) : (
                    <span className="text-green-500 text-sm font-semibold">+{(BOISSONS.find(b => b.nom === config.boisson1)?.prix || 0).toFixed(2)}€</span>
                  )}
                </div>
              )}
              {config.boisson2 && (
                <div className="flex justify-between items-start">
                  <div className="flex gap-2"><span className="text-[var(--text-secondary)] text-sm ml-5">Boisson 2: {config.boisson2}</span></div>
                  <span className="text-green-500 text-sm font-semibold">+{(BOISSONS.find(b => b.nom === config.boisson2)?.prix || 0).toFixed(2)}€</span>
                </div>
              )}
            </div>

            <div className="border-t border-[var(--border-color)] pt-6">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[var(--text-secondary)] font-medium">Total</span>
                <span className="text-3xl font-bold font-[family-name:var(--font-outfit)] text-[var(--orange)]">{prixTotal.toFixed(2)}€</span>
              </div>
              <button 
                onClick={validerPanier}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-[var(--orange)] text-white font-bold shadow-[0_0_30px_rgba(232,93,4,0.3)] transition-all active:scale-[0.98]"
              >
                <ShoppingBag size={20} />
                <span>Ajouter au panier</span>
              </button>
            </div>
         </div>
      )}

      </div>
    </div>
  );
}
