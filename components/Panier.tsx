'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Pencil, ShoppingBag, MessageCircle } from 'lucide-react';
import { usePanierStore, type ArticlePanier } from '@/store/panierStore';
import { genererLienWhatsApp } from '@/lib/whatsapp';

type ArticleCalcule = {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  options: string[];
};

type CheckoutResponse = {
  articles: ArticleCalcule[];
  total: number;
};

export default function Panier() {
  const panierOuvert = usePanierStore(s => s.panierOuvert);
  const fermerPanier = usePanierStore(s => s.fermerPanier);
  const articles = usePanierStore(s => s.articles);
  const supprimerArticle = usePanierStore(s => s.supprimerArticle);
  const viderPanier = usePanierStore(s => s.viderPanier);
  const ouvrirEdition = usePanierStore(s => s.ouvrirEdition);

  const [prixParId, setPrixParId] = useState<Record<number, number>>({});
  const [total, setTotal] = useState<number | null>(null);
  const [chargement, setChargement] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const recalculerTotal = useCallback(async () => {
    if (articles.length === 0) {
      setPrixParId({});
      setTotal(null);
      return;
    }
    setChargement(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const payload = {
        articles: articles.map(a => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { categorie, ...configSansCategorie } = a.config;
          return { produitId: a.produitId, quantite: a.quantite, config: configSansCategorie };
        }),
      };
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;
      const data: CheckoutResponse = await res.json();
      const map: Record<number, number> = {};
      data.articles.forEach((art, i) => {
        if (articles[i]) map[articles[i].id] = art.prixUnitaire;
      });
      setPrixParId(map);
      setTotal(data.total);
    } catch {
      // silencieux si l'API est indisponible
    } finally {
      setChargement(false);
    }
  }, [articles]);

  useEffect(() => {
    if (panierOuvert) recalculerTotal();
  }, [panierOuvert, recalculerTotal]);

  useEffect(() => {
    if (panierOuvert && articles.length >= 0) recalculerTotal();
  }, [articles]);

  const handleSupprimer = (id: number) => {
    supprimerArticle(id);
  };

  const handleModifier = (article: ArticlePanier) => {
    ouvrirEdition(article);
  };

  const handleCommander = async () => {
    if (articles.length === 0) return;
    setEnvoiEnCours(true);
    try {
      const lien = await genererLienWhatsApp(articles);
      window.open(lien, '_blank');
      viderPanier();
      fermerPanier();
    } catch (e) {
      console.error('Erreur WhatsApp :', e);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const resumeOptions = (a: ArticlePanier): string => {
    const opts: string[] = [];
    const c = a.config;
    if (c.avecFritesBoisson) opts.push('Menu Frites + Boisson');
    if (c.taillePoutine === 'XL') opts.push('Taille XL');
    if (c.fritesFromage) opts.push('Frites Cheddar Bacon');
    if (c.gratinage) opts.push(`Gratiné ${c.gratinage}`);
    if (c.viandes?.length) opts.push(c.viandes.join(', '));
    if (c.ingredientsRetires?.length) opts.push(...c.ingredientsRetires.map(i => `Sans ${i}`));
    if (c.sauce) opts.push(`Sauce ${c.sauce}`);
    if (c.boisson1) opts.push(c.boisson1);
    if (c.boisson2) opts.push(c.boisson2);
    const texte = opts.join(' · ');
    return texte.length > 80 ? texte.slice(0, 77) + '...' : texte;
  };

  if (!panierOuvert) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={fermerPanier}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[500px] max-h-[80vh] bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F1F1F] shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-[var(--orange)]" />
            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-outfit)]">
              Mon Panier
            </h2>
            {articles.length > 0 && (
              <span className="bg-[var(--orange)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {articles.reduce((s, a) => s + a.quantite, 0)}
              </span>
            )}
          </div>
          <button
            onClick={fermerPanier}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white hover:bg-[#2A2A2A] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        {articles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 px-6 text-center">
            <ShoppingBag size={56} className="text-[#333]" />
            <p className="text-gray-400 text-lg">Votre panier est vide</p>
            <Link
              href="/menu"
              onClick={fermerPanier}
              className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-bold px-8 py-3 rounded-full transition-all"
            >
              Voir le menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {articles.map(article => {
                const prixUnitaire = prixParId[article.id];
                const prixLigne = prixUnitaire != null
                  ? (prixUnitaire * article.quantite).toFixed(2)
                  : null;
                const resume = resumeOptions(article);

                return (
                  <div
                    key={article.id}
                    className="flex gap-3 p-3 bg-[var(--bg-secondary)] rounded-2xl border border-[#1F1F1F]"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#111]">
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.nom}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={28} className="text-[#333]" />
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-white font-semibold text-sm leading-tight line-clamp-2 font-[family-name:var(--font-outfit)]">
                          {article.quantite > 1 && (
                            <span className="text-[var(--orange)] mr-1">{article.quantite}x</span>
                          )}
                          {article.nom}
                        </span>
                        {prixLigne && (
                          <span className="text-[var(--orange)] font-bold text-sm shrink-0">
                            {prixLigne}€
                          </span>
                        )}
                        {!prixLigne && chargement && (
                          <span className="text-gray-500 text-xs shrink-0">…</span>
                        )}
                      </div>

                      {resume && (
                        <p className="text-gray-500 text-xs leading-snug">{resume}</p>
                      )}

                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleModifier(article)}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] px-3 py-1.5 rounded-full transition-all"
                        >
                          <Pencil size={12} />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleSupprimer(article.id)}
                          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-full transition-all"
                        >
                          <Trash2 size={12} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[#1F1F1F] shrink-0 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total estimé</span>
                <span className="text-2xl font-bold text-white font-[family-name:var(--font-outfit)]">
                  {chargement
                    ? <span className="text-gray-500 text-lg">Calcul…</span>
                    : total != null
                      ? <>{total.toFixed(2)}<span className="text-[var(--orange)]">€</span></>
                      : '—'
                  }
                </span>
              </div>

              <button
                onClick={handleCommander}
                disabled={envoiEnCours || chargement}
                className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                  envoiEnCours || chargement
                    ? 'bg-[var(--orange)]/40 text-white/50 cursor-not-allowed'
                    : 'bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white shadow-[0_0_30px_rgba(232,93,4,0.25)] active:scale-[0.98]'
                }`}
              >
                <MessageCircle size={22} />
                {envoiEnCours ? 'Ouverture WhatsApp…' : 'Commander sur WhatsApp'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
