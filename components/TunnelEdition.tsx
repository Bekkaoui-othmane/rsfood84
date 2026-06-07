'use client';

import { useEffect, useState } from 'react';
import { usePanierStore } from '@/store/panierStore';
import TunnelCommande from '@/components/TunnelCommande';
import { mapperCategorie } from '@/lib/utils';
import type { Produit, Ingredient, ProduitTag, Tag } from '@prisma/client';

type ProduitComplet = Produit & {
  ingredients: Ingredient[];
  produitTags: (ProduitTag & { tag: Tag })[];
};

export default function TunnelEdition() {
  const articleEnEdition = usePanierStore((state) => state.articleEnEdition);
  const fermerEdition = usePanierStore((state) => state.fermerEdition);
  const [produit, setProduit] = useState<ProduitComplet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!articleEnEdition) {
      setProduit(null);
      return;
    }

    const fetchProduit = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/produits/${articleEnEdition.produitId}`);
        if (!res.ok) throw new Error('Produit introuvable');
        const data: ProduitComplet = await res.json();
        setProduit(data);
      } catch (err) {
        console.error('Erreur édition produit:', err);
        fermerEdition();
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [articleEnEdition, fermerEdition]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (!articleEnEdition || !produit) return null;

  return (
    <TunnelCommande
      produit={{
        id: String(produit.id),
        nom: produit.nom,
        prixBase: produit.prix,
        description: produit.description || '',
        image: produit.image || '',
        categorie: mapperCategorie(produit.categorie),
        ingredientsDemontables: produit.produitTags
          .filter(pt => pt.type === 'ingredient_demontable')
          .map(pt => pt.tag.nom),
      }}
      configInitiale={articleEnEdition.config}
      articleIdEnEdition={articleEnEdition.id}
      onFermer={fermerEdition}
    />
  );
}
