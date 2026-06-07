'use client';

import { useState } from 'react';
import type { Produit, Ingredient, ProduitTag, Tag } from '@prisma/client';
import ProduitCard from '@/components/ProduitCard';
import TunnelCommande from '@/components/TunnelCommande';
import { mapperCategorie } from '@/lib/utils';

type ProduitAvecIngredients = Produit & {
  ingredients: Ingredient[];
  produitTags: (ProduitTag & { tag: Tag })[];
};

interface MenuClientProps {
  produits: ProduitAvecIngredients[];
  categories: string[];
}

export default function MenuClient({ produits, categories }: MenuClientProps) { 
  // --- ÉTATS LOCAUX ---
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');     
  const [produitSelectionne, setProduitSelectionne] = useState<ProduitAvecIngredients | null>(null);
    // Ajout de "Tous" en première position des filtres
    const allCategories = ['Tous', ...categories];
  // --- REGROUPEMENT DES DONNÉES ---
  // Regroupement dynamique des produits par catégorie
  const produitsParCategorie = categories.reduce((acc, cat) => {
    acc[cat] = produits.filter(p => p.categorie === cat);
    return acc;
  }, {} as Record<string, ProduitAvecIngredients[]>);

  // Catégories à afficher selon le filtre sélectionné par l'utilisateur
  const categoriesToDisplay = selectedCategory === 'Tous' 
    ? categories 
    : [selectedCategory];

  return (
    <>
      {/* Navigation rapide entre catégories (Filtres) */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {allCategories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full border transition-all font-medium ${
              selectedCategory === cat
                ? 'border-[var(--orange)] bg-[var(--orange)] text-white shadow-[0_0_15px_rgba(232,93,4,0.3)]'
                : 'border-[#333] bg-[#0A0A0A] text-gray-400 hover:border-[var(--orange)] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilles de produits par catégorie */}
      <div className="space-y-16">
        {categoriesToDisplay.map((cat) => {
          // Vérification pour ne pas afficher de section si elle est vide
          if (!produitsParCategorie[cat] || produitsParCategorie[cat].length === 0) return null;

          return (
            <section 
              key={cat} 
              className="bg-[#111] border border-[#222] rounded-2xl p-6 md:p-8 shadow-lg"
            >
              {/* Titre de la catégorie */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
                  {cat}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--orange)] to-transparent opacity-50"></div>
              </div>
              
              {/* Container de la grille des produits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {produitsParCategorie[cat].map(produit => (
                  <ProduitCard 
                    key={produit.id} 
                    // Adaptation stricte du type Prisma vers l'interface ProduitPlaceholder attendue par ProduitCard
                    produit={{
                      id: Number(produit.id), // Fallback sécurisé en nombre pour ProduitCard
                      nom: produit.nom,
                      description: produit.description || '',
                      prix: produit.prix,
                      image: produit.image || '',
                      categorie: produit.categorie,
                      // Transmission des ingrédients démontables formattés vers la carte
                      ingredients: produit.ingredients
                        .filter((i: Ingredient) => !i.estSuppl)
                        .map((i: Ingredient) => ({
                           nom: i.nom,
                           prix: i.prix,
                           estSuppl: i.estSuppl
                        })),
                    }} 
                    onBuyClick={() => setProduitSelectionne(produit)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal du tunnel de commande (Configuration produit) */}
      {produitSelectionne && (
        <TunnelCommande
          // Adaptation stricte du type Prisma vers l'interface ProduitValide attendue par TunnelCommande
          produit={{
            id: String(produitSelectionne.id),
            nom: produitSelectionne.nom,
            prixBase: produitSelectionne.prix, // Prisma utilise 'prix', TunnelCommande attend 'prixBase'
            description: produitSelectionne.description || '',
            categorie: mapperCategorie(produitSelectionne.categorie),
            // Extraction en base de données dynamique des ingrédients démontables
            ingredientsDemontables: produitSelectionne.produitTags
              .filter(pt => pt.type === 'ingredient_demontable')
              .map(pt => pt.tag.nom)
          }}
          onFermer={() => setProduitSelectionne(null)}
        />
      )}
    </>
  );
}