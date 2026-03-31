'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { usePanierStore } from '@/store/panierStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const ouvrirPanier = usePanierStore((state) => state.ouvrirPanier);
  const nombreArticles = usePanierStore((state) => state.nombreArticles());

  // Gestion de l'hydratation et du scroll
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      // Devient "scrolled" dès qu'on défile un peu vers le bas
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Notre Histoire', href: '/histoire' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 flex justify-center transition-all duration-300 ${
        isScrolled ? 'pt-4' : 'pt-0'
      }`}
    >
      <div 
        className={`flex items-center justify-between backdrop-blur-md transition-all duration-300 ${
          isScrolled 
            ? 'h-14 w-[95%] md:w-[70%] max-w-4xl rounded-full bg-[#0A0A0A]/85 border border-[#1F1F1F] px-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'h-16 w-full rounded-none bg-[#0A0A0A]/95 border-b border-[#1F1F1F] px-6 md:px-8'
        }`}
      >
        {/* Gauche : Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Rs Food84
        </Link>

        {/* Centre : Liens de navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--orange)] font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Droite : Bouton Panier */}
        <button
          onClick={ouvrirPanier}
          className="w-10 h-10 relative flex items-center justify-center rounded-full bg-[var(--orange)] text-white transition-all duration-200 hover:bg-[var(--orange-hover)] hover:scale-105"
          aria-label="Ouvrir le panier"
        >
          <ShoppingCart size={18} />
          
          {/* Badge nombre d'articles */}
          {isMounted && nombreArticles > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-[4px] text-[10px] font-bold text-white border-2 border-[#0A0A0A]">
              {nombreArticles}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
