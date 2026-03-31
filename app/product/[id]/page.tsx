'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';import { ArrowLeft, Info, Check, X } from 'lucide-react';
import { produitsInitialData } from '@/lib/placeholder-data';
import { usePanierStore } from '@/store/panierStore';
import { ProduitPlaceholder } from '@/components/ProduitCard';

// Type pour récupérer l'ID depuis l'URL
export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const index = parseInt(params.id) - 1;
  const produit = produitsInitialData[index] as ProduitPlaceholder;

  // État local pour la personnalisation
  const [isMenu, setIsMenu] = useState(false);
  const PRIX_MENU = 2.50; // Prix fixe ajouté pour la formule (frites + boisson)
  
  const [messagePerso, setMessagePerso] = useState('');

  // État pour les ingrédients (vrai = inclus, faux = retiré/non sélectionné)
  const [ingredientsState, setIngredientsState] = useState<Record<string, boolean>>(() => {
    if (!produit) return {};
    return produit.ingredients.reduce((acc, ing) => {
      // Pour les Tacos, on démarre avec 0 viande cochée par défaut
      if (produit.categorie === 'Tacos' && ["Tenders", "Escalope", "Steak", "Cordon Bleu", "Viande Hachée"].includes(ing.nom)) {
        acc[ing.nom] = false;
      } else {
        acc[ing.nom] = !ing.estSuppl; // Par défaut : de base = true, supplément = false
      }
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  // Limites spécifiques pour les Tacos
  const maxViandes = produit?.categorie === 'Tacos' 
    ? (produit.nom.includes("1 Viande") ? 1 : produit.nom.includes("2 Viandes") ? 2 : produit.nom.includes("3 Viandes") ? 3 : 1)
    : 0;

  // Zustand store
  const ajouterAuPanier = usePanierStore(state => state.ajouterArticle);

  if (!produit) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2>Produit introuvable</h2>
      </div>
    );
  }

  // Calcul du prix supplémentaire venu des suppléments
  const extraPrix = produit.ingredients.reduce((acc, ing) => {
    if (ing.estSuppl && ingredientsState[ing.nom]) {
      return acc + ing.prix;
    }
    return acc;
  }, 0);

  // Prix total dynamique
  const prixTotal = produit.prix + (isMenu ? PRIX_MENU : 0) + extraPrix;

  const toggleIngredient = (nom: string) => {
    const estChoixViande = produit.categorie === 'Tacos' && ["Tenders", "Escalope", "Steak", "Cordon Bleu", "Viande Hachée"].includes(nom);
    
    // Si c'est une viande de Tacos et qu'elle n'est pas encore cochée
    if (estChoixViande && maxViandes > 0 && !ingredientsState[nom]) {
      // Compter combien de viandes sont déjà cochées
      const viandesCocheesInfo = Object.keys(ingredientsState).filter(k => 
        ingredientsState[k] && ["Tenders", "Escalope", "Steak", "Cordon Bleu", "Viande Hachée"].includes(k)
      ).length;

      if (viandesCocheesInfo >= maxViandes) {
        alert(`Vous ne pouvez choisir que ${maxViandes} viande(s) pour ce Tacos.`);
        return; // On bloque la coche
      }
    }

    setIngredientsState(prev => ({
      ...prev,
      [nom]: !prev[nom]
    }));
  };

  const handleAjouterPanier = () => {
    // Vérification du nombre de viandes pour un Tacos avant ajout
    if (produit.categorie === 'Tacos') {
      const viandesCocheesInfo = Object.keys(ingredientsState).filter(k => 
        ingredientsState[k] && ["Tenders", "Escalope", "Steak", "Cordon Bleu", "Viande Hachée"].includes(k)
      ).length;
      
      if (viandesCocheesInfo !== maxViandes) {
        alert(`Veuillez sélectionner exactement ${maxViandes} viande(s) pour commander ce Tacos.`);
        return;
      }
    }

    // Générer la liste des personnalisations à afficher dans le panier
    const personnalisations = [];
    
    // Ingrédients retirés
    produit.ingredients.forEach(ing => {
      if (!ing.estSuppl && !ingredientsState[ing.nom]) {
        personnalisations.push({ type: 'retrait' as const, nom: `Sans ${ing.nom}`, prix: 0 });
      }
      // Suppléments ajoutés
      if (ing.estSuppl && ingredientsState[ing.nom]) {
        personnalisations.push({ type: 'ajout' as const, nom: `Supplément ${ing.nom}`, prix: ing.prix });
      }
    });

    if (messagePerso.trim().length > 0) {
      personnalisations.push({ type: 'ajout' as const, nom: messagePerso, prix: 0 });
    }

    ajouterAuPanier({
      id: index + 1,
      nom: produit.nom,
      prix: prixTotal, // Prix avec ou sans menu et avec suppléments
      quantite: 1,
      image: produit.image,
      personnalisations: personnalisations
    });
    
    // Retour au menu
    router.push('/menu');
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] pt-24 pb-32 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Bouton Retour */}
        <Link 
          href="/menu" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--orange)] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Retour au menu
        </Link>
        
        <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl overflow-hidden flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          {/* Image en Grand (Haut) */}
          <div className="w-full h-72 md:h-96 relative bg-black">
            <Image
              src={produit.image}
              alt={produit.nom}
              fill
              className="object-cover"
            />
            {/* Lueur ou badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent"></div>
            {produit.categorie === 'Tacos' && (
              <div className="absolute top-6 right-6 bg-[var(--orange)] text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                Sur Mesure
              </div>
            )}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)] drop-shadow-lg">
                  {produit.nom}
                </h1>
                <p className="text-gray-300 font-[family-name:var(--font-inter)] text-lg max-w-2xl drop-shadow-md">
                  {produit.description}
                </p>
              </div>
              <div className="text-4xl font-bold text-[var(--orange)] drop-shadow-lg shrink-0">
                {produit.prix.toFixed(2)}€
              </div>
            </div>
          </div>

          {/* Contenu - Ingrédients et Options */}
          <div className="p-6 md:p-10 flex flex-col gap-10">

            {/* Ingrédients (Boutons pour retirer ou ajouter) */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
                Personnalisez vos ingrédients
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {produit.ingredients.map((ing, idx) => {
                  const isSelected = ingredientsState[ing.nom];
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleIngredient(ing.nom)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-[var(--orange)] bg-[var(--orange)]/10' 
                          : 'border-[#1F1F1F] bg-[#1A1A1A] hover:border-[#333]'
                      }`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-500 line-through'}`}>
                          {ing.nom}
                        </span>
                        {ing.estSuppl && (
                          <span className="text-sm text-[var(--orange)]">
                            +{ing.prix.toFixed(2)}€
                          </span>
                        )}
                        {!ing.estSuppl && (
                          <span className="text-xs text-gray-400">
                            Inclus de base
                          </span>
                        )}
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[var(--orange)] text-white' : 'bg-[#333] text-gray-500'
                      }`}>
                        {isSelected ? <Check size={16} /> : <X size={16} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-[#1F1F1F]"></div>

            {/* Option Formule Menu */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
                Choisissez votre formule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setIsMenu(false)}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center text-center ${
                    !isMenu 
                      ? 'border-[var(--orange)] bg-[var(--orange)]/10 text-white shadow-[0_0_15px_rgba(232,93,4,0.15)]' 
                      : 'border-[#1F1F1F] bg-[#1A1A1A] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span className="text-xl font-bold mb-2">Produit Seul</span>
                  <span className="text-gray-400 text-sm">Pas d&apos;accompagnement</span>
                </button>

                <button
                  onClick={() => setIsMenu(true)}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center text-center ${
                    isMenu 
                      ? 'border-[var(--orange)] bg-[var(--orange)]/10 text-white shadow-[0_0_15px_rgba(232,93,4,0.15)]' 
                      : 'border-[#1F1F1F] bg-[#1A1A1A] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span className="text-xl font-bold mb-2">Formule Menu</span>
                  <span className="text-[var(--orange)] font-bold mb-1">+ {PRIX_MENU.toFixed(2)}€</span>
                  <span className="text-sm">Boisson 33cl + Grande frite</span>
                </button>
              </div>
            </div>

            {/* Note additionnelle (Tacos + Texte libre) */}
            <div className="flex flex-col gap-4">
              {produit.categorie === 'Tacos' && (
                <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[var(--orange)]/30">
                  <h3 className="text-[var(--orange)] font-bold mb-2 flex items-center gap-2">
                    <Info size={18} />
                    Instructions pour Tacos
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Si votre Tacos permet de choisir plusieurs viandes, ou que vous voulez préciser vos sauces, écrivez-le ici :
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Remarques spéciales (ex: sans sel, sans sauce...)</h3>
                <textarea
                  value={messagePerso}
                  onChange={(e) => setMessagePerso(e.target.value)}
                  placeholder="Apportez une précision à notre cuisinier..."
                  className="w-full bg-[#1A1A1A] border border-[#1F1F1F] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--orange)] resize-none h-28 transition-colors"
                ></textarea>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Barre fixe en bas pour Ajouter au panier - Visible même en scrollant */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] border-t border-[#1F1F1F] p-4 px-6 md:px-12 z-40 flex items-center justify-between gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total</span>
            <span className="text-3xl font-bold text-white">
              {prixTotal.toFixed(2)}<span className="text-[var(--orange)]">€</span>
            </span>
          </div>
          
          <button 
            onClick={handleAjouterPanier}
            className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white py-4 px-8 rounded-xl font-bold text-lg md:text-xl transition-transform hover:-translate-y-1 shadow-lg shadow-orange-500/20 text-center uppercase tracking-wide"
          >
            Ajouter à ma commande
          </button>
        </div>
      </div>
    </div>
  );
}