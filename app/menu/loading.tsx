// app/menu/loading.tsx
import React from 'react';

export default function Loading() {
  // Création d'un tableau abstrait de 6 éléments pour simuler la grille de cartes
  const skeletonCartes = Array.from({ length: 6 });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-inter)]">
      
      {/* Skeleton pour l'en-tête (Titre et boutons de filtres) */}
      <div className="max-w-7xl mx-auto mb-12 animate-pulse flex flex-col items-center">
        <div className="h-10 w-48 bg-[#1A1A1A] rounded-full mb-8"></div>
        <div className="flex justify-center gap-4 overflow-hidden w-full max-w-2xl">
          <div className="h-12 w-24 bg-[#1A1A1A] rounded-xl flex-shrink-0"></div>
          <div className="h-12 w-24 bg-[#1A1A1A] rounded-xl flex-shrink-0"></div>
          <div className="h-12 w-24 bg-[#1A1A1A] rounded-xl flex-shrink-0"></div>
          <div className="h-12 w-24 bg-[#1A1A1A] rounded-xl flex-shrink-0 hidden sm:block"></div>
        </div>
      </div>

      {/* Grille principale de 6 cartes Skeleton animées */}
      {/* Même layout : 1 colonne mobile, 2 tablette, 3 desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletonCartes.map((_, index) => (
          <div 
            key={index}
            className="h-[350px] bg-[#1A1A1A] rounded-3xl border border-[#333] animate-pulse shadow-lg"
          >
            {/* Si besoin de simuler la structure interne de la carte, 
                on ajoute des rectangles gris plus clairs à l'intérieur. 
                Ici on respecte : "juste des rectangles gris arrondis". */}
          </div>
        ))}
      </div>
      
    </div>
  );
}