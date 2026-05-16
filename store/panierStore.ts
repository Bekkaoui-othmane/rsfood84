import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Import du type ConfigCommande pour l'article (Règle 6)
import { ConfigCommande } from '@/lib/types';

export type Personnalisation = {
  nom: string;
  // Suppression du prix dans Personnalisation (Règle 1)
  type: 'ajout' | 'retrait';
};

export type ArticlePanier = {
  id: number;
  // Ajout de produitId pour identifier le produit côté serveur (Règle 5)
  produitId: string;
  nom: string;
  // Suppression du prix dans ArticlePanier (Règle 2)
  image: string;
  quantite: number;
  personnalisations: Personnalisation[];
  // Ajout de config dans ArticlePanier (Règle 6)
  config: ConfigCommande;
};

interface PanierState {
  articles: ArticlePanier[];
  panierOuvert: boolean;
  articleEnEdition: ArticlePanier | null;
  ajouterArticle: (article: ArticlePanier) => void;
  retirerArticle: (id: number) => void;
  supprimerArticle: (id: number) => void;
  remplacerArticle: (ancienId: number, nouvelArticle: ArticlePanier) => void;
  viderPanier: () => void;
  ouvrirPanier: () => void;
  fermerPanier: () => void;
  ouvrirEdition: (article: ArticlePanier) => void;
  fermerEdition: () => void;
  // Suppression de calculerTotal() dans l'interface (Règle 3)
  nombreArticles: () => number;
}

// Fonction utilitaire pour comparer les personnalisations
const sontPersonnalisationsIdentiques = (p1: Personnalisation[], p2: Personnalisation[]) => {
  if (p1.length !== p2.length) return false;
  
  // Tri pour s'assurer que l'ordre n'affecte pas l'égalité
  const trierPerso = (a: Personnalisation, b: Personnalisation) => a.nom.localeCompare(b.nom);
  const sorted1 = [...p1].sort(trierPerso);
  const sorted2 = [...p2].sort(trierPerso);
  
  return sorted1.every((p, index) => 
    p.nom === sorted2[index].nom && 
    p.type === sorted2[index].type
    // Suppression de la comparaison du prix (Règle 4)
  );
};

export const usePanierStore = create<PanierState>()(
  persist(
    (set, get) => ({
      articles: [],
      panierOuvert: false,
      articleEnEdition: null,

      ajouterArticle: (nouvelArticle) => {
        set((state) => {
          const index = state.articles.findIndex(
            (a) => a.id === nouvelArticle.id && sontPersonnalisationsIdentiques(a.personnalisations, nouvelArticle.personnalisations)
          );

          if (index !== -1) {
            // L'article existe avec les mêmes personnalisations, on incrémente la quantité
            const nouvellesArticles = [...state.articles];
            nouvellesArticles[index].quantite += nouvelArticle.quantite;
            return { articles: nouvellesArticles };
          }
          
          // L'article n'existe pas ou a des personnalisations différentes, on l'ajoute
          return { articles: [...state.articles, nouvelArticle] };
        });
      },

      retirerArticle: (id) => {
        set((state) => {
          const nouvellesArticles = state.articles.map(article => 
            article.id === id ? { ...article, quantite: article.quantite - 1 } : article
          ).filter(article => article.quantite > 0);
          
          return { articles: nouvellesArticles };
        });
      },

      supprimerArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
        }));
      },

      remplacerArticle: (ancienId, nouvelArticle) => {
        set((state) => ({
          articles: [
            ...state.articles.filter((a) => a.id !== ancienId),
            nouvelArticle,
          ],
        }));
      },

      viderPanier: () => set({ articles: [] }),

      ouvrirPanier: () => set({ panierOuvert: true }),

      fermerPanier: () => set({ panierOuvert: false }),

      ouvrirEdition: (article) => set({ articleEnEdition: article, panierOuvert: false }),

      fermerEdition: () => set({ articleEnEdition: null }),

      // Suppression de l'implémentation de calculerTotal (Règle 3)

      nombreArticles: () => {
        const { articles } = get();
        return articles.reduce((total, article) => total + article.quantite, 0);
      }
    }),
    {
      name: 'panier-storage',
      partialize: (state) => ({ articles: state.articles }), // Persiste uniquement les articles
    }
  )
);
