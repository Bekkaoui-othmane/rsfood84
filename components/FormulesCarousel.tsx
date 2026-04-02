'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageModal from './ImageModal';

const formules = [
  {
    id: 1,
    titre: "Menu Burger",
    description: "Tous vos burgers préférés disponibles en formule avec frites et boisson.",
    image: "/images/Menu_formule/Menu_Burger.png",
    lien: "/menu"
  },
  {
    id: 2,
    titre: "Menu Sandwich",
    description: "Vos sandwichs bien garnis, accompagnés de frites et d'une boisson bien fraîche.",
    image: "/images/Menu_formule/Menu_Sandwich.png",
    lien: "/menu"
  },
  {
    id: 3,
    titre: "Menu Poutine",
    description: "Découvrez nos incroyables poutines canadiennes en formule complète !",
    image: "/images/Menu_formule/Menu_Poutine.png",
    lien: "/menu"
  },
  {
    id: 4,
    titre: "Fiche Tacos",
    description: "Composez le tacos de vos rêves : 1, 2 ou 3 viandes, avec sa sauce fromagère maison.",
    image: "/images/Menu_formule/Fiche_tacos.png",
    lien: "/menu"
  },
  {
    id: 5,
    titre: "Menu RS1",
    description: "Le fameux Cheese + Double Cheese, en formule complète avec Frites et Boisson.",
    image: "/images/Menu_formule/Menu_rs1.png",
    lien: "/menu"
  },
  {
    id: 6,
    titre: "Menu RS2",
    description: "Votre Cheese + Chicken préféré, en formule complète avec Frites et Boisson.",
    image: "/images/Menu_formule/Menu_rs2.png",
    lien: "/menu"
  }
];

export default function FormulesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -380 : 380;
      const maxScroll = current.scrollWidth - current.clientWidth;

      if (direction === 'right') {
        // Si on est déjà tout à la fin, on retourne au début
        if (current.scrollLeft >= maxScroll - 5) {
          current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else if (direction === 'left') {
        // Si on est déjà tout au début, on va tout à la fin
        if (current.scrollLeft <= 5) {
          current.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
          Nos <span className="text-[var(--orange)]">Menus & Formules</span>
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
        {formules.map((formule) => (
          <div key={formule.id} className="min-w-[280px] w-[300px] md:w-[350px] flex-shrink-0 snap-start">
            <div className="group block h-full relative">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--orange)] hover:shadow-[0_0_20px_rgba(232,93,4,0.3)] hover:-translate-y-1 h-full flex flex-col">
                {/* Image */}
                <div 
                  className="relative w-full aspect-[4/3] overflow-hidden bg-black flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImage({ src: formule.image, alt: formule.titre });
                  }}
                >
                  <Image
                    src={formule.image}
                    alt={formule.titre}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Icône Loupe visible au survol */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                    <div className="bg-black/60 p-3 rounded-full text-white border border-[#333]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-6 flex flex-col flex-grow items-center text-center">
                  <Link href={formule.lien} className="w-full">
                    <h3 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-outfit)] group-hover:text-[var(--orange)] transition-colors">
                      {formule.titre}
                    </h3>
                  </Link>
                  <Link href={formule.lien} className="w-full">
                    <p className="text-sm text-gray-400 font-[family-name:var(--font-inter)] leading-relaxed">
                      {formule.description}
                    </p>
                  </Link>
                  <div className="mt-6">
                    <Link href={formule.lien} className="inline-block bg-[#1A1A1A] border border-[#333] text-[var(--orange)] font-semibold px-6 py-2 rounded-full hover:bg-[var(--orange)] hover:text-white transition-all duration-300">
                      Découvrir
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ImageModal 
        src={selectedImage?.src || ''}
        alt={selectedImage?.alt || ''}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
