'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { produitsInitialData } from '@/lib/placeholder-data';
import { ProduitPlaceholder } from '@/components/ProduitCard';
import ImageModal from '@/components/ImageModal';
import TunnelCommande from '@/components/TunnelCommande';

export default function ProductPage({ params }: { params: { id: string } }) {
  const index = parseInt(params.id) - 1;
  const produit = produitsInitialData[index] as ProduitPlaceholder;

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isTunnelOpen, setIsTunnelOpen] = useState(false);

  if (!produit) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h2>Produit introuvable</h2>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] pt-24 pb-32 px-4 md:px-8 font-[family-name:var(--font-inter)]">
      <div className="max-w-4xl mx-auto">
        
        <Link 
          href="/menu" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--orange)] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Retour au menu
        </Link>
        
        <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl overflow-hidden flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          
          <div 
            className="group w-full h-72 md:h-96 relative bg-black cursor-pointer overflow-hidden"
            onClick={() => setIsImageModalOpen(true)}
          >
            <Image
              src={produit.image}
              alt={produit.nom}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 flex items-center justify-center">
                 <div className="opacity-0 tracking-wider text-white font-bold transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center bg-black/50 rounded-full p-4 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
                 </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent"></div>
            {produit.categorie === 'Tacos' && (
              <div className="absolute top-6 right-6 z-10 bg-[var(--orange)] text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                Sur Mesure
              </div>
            )}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)] drop-shadow-lg">
                  {produit.nom}
                </h1>
              </div>
              <div className="text-4xl font-bold text-[var(--orange)] drop-shadow-lg shrink-0">
                {produit.prix.toFixed(2)}€
              </div>
            </div>
          </div>

          <ImageModal 
            src={produit.image} 
            alt={produit.nom}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />

          <div className="p-6 md:p-10">
            <p className="text-gray-300 font-[family-name:var(--font-inter)] text-lg leading-relaxed">
              {produit.description}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] border-t border-[#1F1F1F] p-4 px-6 md:px-12 z-40 flex items-center justify-center gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Prix de base</span>
            <span className="text-3xl font-bold text-white">
              {produit.prix.toFixed(2)}<span className="text-[var(--orange)]">€</span>
            </span>
          </div>
          <button 
            onClick={() => setIsTunnelOpen(true)}
            className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white py-4 px-8 rounded-xl font-bold text-lg md:text-xl transition-transform hover:-translate-y-1 shadow-lg shadow-orange-500/20 text-center uppercase tracking-wide w-full md:w-auto"
          >
            Configurer & Ajouter
          </button>
        </div>
      </div>

      {isTunnelOpen && (
        <TunnelCommande
          produit={{
            id: String(produit.id),
            nom: produit.nom,
            prixBase: produit.prix,
            description: produit.description,
            categorie: (produit.categorie.toLowerCase() === 'tacos' ? 'tacos' : produit.categorie.toLowerCase().replace(/s$/, '').replace('sandwich', 'burger')) as 'burger' | 'tacos' | 'poutine' | 'formule',
            ingredientsDemontables: produit.ingredientsDemontables ?? [],
          }}
          onFermer={() => {
            setIsTunnelOpen(false);
          }}
        />
      )}
    </div>
  );
}
