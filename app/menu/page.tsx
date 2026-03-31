'use client';

import { useState } from 'react';
import { produitsInitialData } from "@/lib/placeholder-data";
import ProduitCard, { ProduitPlaceholder } from "@/components/ProduitCard";

// Cette page est maintenant un Client Component pour permettre le filtrage interactif.
// Pour l'instant, nous générons des IDs factices basés sur l'index de la liste statique.
// Plus tard, ces données viendront de Prisma.
export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  const produits = produitsInitialData.map((p, index) => ({
    id: index + 1,
    ...p
  })) as ProduitPlaceholder[];

  // Regrouper par catégories en conservant un ordre logique
  const baseCategories = ["Burgers", "Sandwichs", "Tacos", "Poutines"];
  const allCategories = ["Tous", ...baseCategories];
  
  const produitsParCategorie = baseCategories.reduce((acc, cat) => {
    acc[cat] = produits.filter(p => p.categorie === cat);
    return acc;
  }, {} as Record<string, ProduitPlaceholder[]>);

  // Déterminer quelles catégories afficher selon le filtre
  const categoriesToDisplay = selectedCategory === "Tous" 
    ? baseCategories 
    : [selectedCategory];

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-outfit)]">
            Notre <span className="text-[var(--orange)]">Menu</span>
          </h1>
          <p className="text-gray-400 font-[family-name:var(--font-inter)] max-w-2xl mx-auto">
            Découvrez nos spécialités. Cliquez sur un produit pour voir les détails, le personnaliser ou choisir l&apos;option Menu (Frites + Boisson).
          </p>
        </div>

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
            // Ne pas afficher la section si elle est vide
            if (!produitsParCategorie[cat] || produitsParCategorie[cat].length === 0) return null;

            return (
              <section 
                key={cat} 
                className="bg-[#111] border border-[#222] rounded-2xl p-6 md:p-8 shadow-lg"
              >
                {/* Titre de catégorie */}
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    {cat}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--orange)] to-transparent opacity-50"></div>
                </div>
                
                {/* Grille */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {produitsParCategorie[cat].map(produit => (
                    <ProduitCard key={produit.id} produit={produit} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}