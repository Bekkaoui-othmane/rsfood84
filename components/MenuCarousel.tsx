'use client';

import { useRef } from 'react';
import { produitsInitialData } from '@/lib/placeholder-data';
import ProduitCard, { ProduitPlaceholder } from '@/components/ProduitCard';

export default function MenuCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtrer pour ne pas intégrer les formules ni les frites (s'il y en a)
  const items = produitsInitialData
    .map((p, index) => ({ ...p, id: index + 1 }))
    .filter(
      p =>
        p.categorie !== 'Formules' &&
        !p.nom.toLowerCase().includes('frites')
    );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      const maxScroll = current.scrollWidth - current.clientWidth;

      if (direction === 'right') {
        if (current.scrollLeft >= maxScroll - 5) {
          current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else if (direction === 'left') {
        if (current.scrollLeft <= 5) {
          current.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
          Nos <span className="text-[var(--orange)]">Classiques</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white hover:bg-[var(--orange)] hover:border-[var(--orange)] transition-all"
          >
            &#8592;
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white hover:bg-[var(--orange)] hover:border-[var(--orange)] transition-all"
          >
            &#8594;
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((produit) => (
          <div key={produit.id} className="min-w-[280px] w-[280px] flex-shrink-0 snap-start">
            <ProduitCard produit={produit as ProduitPlaceholder} />
          </div>
        ))}
      </div>
    </div>
  );
}
