import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Personnalisation = {
  nom: string;
  prix: number;
  type: 'ajout' | 'retrait';
};

export type ArticlePanier = {
  id: number;
  nom: string;
  prix: number;
  image: string;
  quantite: number;
  personnalisations: Personnalisation[];
};

interface PanierState {
  articles: ArticlePanier[];
  panierOuvert: boolean;
  ajouterArticle: (article: ArticlePanier) => void;
  retirerArticle: (id: number) => void;
  supprimerArticle: (id: number) => void;
  viderPanier: () => void;
  ouvrirPanier: () => void;
  fermerPanier: () => void;
  calculerTotal: () => number;
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
    p.type === sorted2[index].type &&
    p.prix === sorted2[index].prix
  );
};

export const usePanierStore = create<PanierState>()(
  persist(
    (set, get) => ({
      articles: [],
      panierOuvert: false,

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

      viderPanier: () => set({ articles: [] }),

      ouvrirPanier: () => set({ panierOuvert: true }),

      fermerPanier: () => set({ panierOuvert: false }),

      calculerTotal: () => {
        const { articles } = get();
        const total = articles.reduce((somme, article) => somme + (article.prix * article.quantite), 0);
        return parseFloat(total.toFixed(2));
      },

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
