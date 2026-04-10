'use client';

import React, { useEffect } from 'react';

// Types stricts respectant la doc "Error Handling" du routeur d'application Next.js (App Router)
type PropsErreur = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LoadingMenuError({ error, reset }: PropsErreur) {
  // Enregistrement de l'erreur dans la console client (souvent utile en debug)
  useEffect(() => {
    console.error("Erreur de récupération menu :", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4 font-[family-name:var(--font-inter)]">
      
      {/* Conteneur modale d'erreur - Même style sombre et orange que les cartes du menu */}
      <div className="bg-[var(--bg-card)] border border-[#333] p-8 md:p-12 rounded-3xl text-center max-w-lg shadow-2xl w-full">
        
        {/* Icône d'erreur (SVG simple, autonome pour ne pas dépendre du paquet lucide-react) */}
        <div className="w-16 h-16 bg-[var(--orange)]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--orange)]">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        {/* Titres et textes d'erreur en français */}
        <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)] mb-4">
          Oups ! Menu indisponible
        </h2>
        
        <p className="text-[var(--text-secondary)] mb-10 text-lg">
          Impossible de charger le menu pour le moment. Veuillez vérifier votre connexion ou réessayer dans quelques instants.
        </p>
        
        {/* Résolution : appel de la fonction reset() fournie par Next.js pour retenter une récupération de données Server Component */}
        <button
          onClick={() => reset()}
          className="px-8 py-4 bg-[var(--orange)] text-white w-full sm:w-auto font-bold rounded-xl hover:bg-[#c94b03] transition-colors shadow-[0_0_20px_rgba(232,93,4,0.3)] active:scale-[0.98]"
        >
          Réessayer
        </button>
      </div>

    </div>
  );
}