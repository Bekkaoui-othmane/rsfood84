'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import ImageModal from './ImageModal';

export interface IngredientPlaceholder {
  nom: string;
  prix: number;
  estSuppl: boolean;
}

export interface ProduitPlaceholder {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  categorie: string;
  ingredients: IngredientPlaceholder[];
}

export default function ProduitCard({ produit }: { produit: ProduitPlaceholder }) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      <div className="group block h-full relative">
        <Link href={`/product/${produit.id}`} className="absolute inset-0 z-0"></Link>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--orange)] hover:shadow-[0_0_20px_rgba(232,93,4,0.3)] hover:-translate-y-1 h-full flex flex-col relative z-10 pointer-events-none">
          
          {/* Image du produit cliquable pour Modal (Bloque la navigation du Link) */}
          <div 
            className="relative w-full aspect-[4/3] overflow-hidden bg-black flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsImageOpen(true);
            }}
          >
            <Image
              src={produit.image}
              alt={produit.nom}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            {/* Icône Loupe visible au survol */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div className="bg-black/60 p-3 rounded-full text-white border border-[#333]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
            </div>
          </div>

          {/* Détails du produit - doivent rester cliquables pour le Link */}
          <div className="p-5 flex flex-col flex-grow pointer-events-auto cursor-pointer" onClick={(e) => {
            // Permet au clique sur le texte de naviguer
          }}>
            <Link href={`/product/${produit.id}`} className="flex justify-between items-start mb-2 group/title">
              <h3 className="text-xl font-bold text-white font-[family-name:var(--font-outfit)] group-hover/title:text-[var(--orange)] transition-colors">
                {produit.nom}
              </h3>
            </Link>
            
            <Link href={`/product/${produit.id}`} className="text-sm text-gray-400 mb-6 flex-grow font-[family-name:var(--font-inter)] line-clamp-2">
              {produit.description}
            </Link>

            <Link href={`/product/${produit.id}`} className="flex items-center justify-between mt-auto">
              <span className="text-2xl font-bold text-[var(--orange)]">
                {produit.prix.toFixed(2)}€
              </span>
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white transition-colors duration-300 group-hover:bg-[var(--orange)] group-hover:border-[var(--orange)]">
                <ShoppingBag size={18} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <ImageModal 
        src={produit.image}
        alt={produit.nom}
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />
    </>
  );
}