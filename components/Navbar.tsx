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
  const [status, setStatus] = useState({ isOpen: false, text: "" });

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      // Devient "scrolled" dès qu'on défile un peu vers le bas
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    // Détermine l'état ouvert/fermé du snack
    const updateStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, 2 = Mardi...
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;

      // Mardi : fermé toute la journée
      if (day === 2) {
        setStatus({ isOpen: false, text: "Fermé - Ouvre Mer. 11h30" });
        return;
      }

      // Horaires : 11h30 - 14h30 et 18h00 - 23h00
      if (currentTime >= 11.5 && currentTime < 14.5) {
        setStatus({ isOpen: true, text: "Ouvert - Ferme à 14h30" });
      } else if (currentTime >= 18.0 && currentTime < 23.0) {
        setStatus({ isOpen: true, text: "Ouvert - Ferme à 23h00" });
      } else {
        if (currentTime < 11.5) {
          setStatus({ isOpen: false, text: "Fermé - Ouvre à 11h30" });
        } else if (currentTime >= 14.5 && currentTime < 18.0) {
          setStatus({ isOpen: false, text: "Fermé - Ouvre à 18h00" });
        } else {
          // Après 23h, on ferme pour la journée
          if (day === 1) { // Si c'est lundi soir, prochaine ouverture mercredi
            setStatus({ isOpen: false, text: "Fermé - Ouvre Mer. 11h30" });
          } else {
            setStatus({ isOpen: false, text: "Fermé - Ouvre à 11h30" });
          }
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Mise à jour toutes les minutes

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
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
            : 'h-16 w-full rounded-none bg-[#0A0A0A]/95 border-b border-[#1F1F1F] px-4 md:px-8'
        }`}
      >
        {/* Gauche : Logo & État Ouverture */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white font-bold xs:text-lg sm:text-xl tracking-tight shrink-0">
            Rs Food84
          </Link>
          
          {/* Badge État du Snack */}
          {isMounted && status.text && (
            <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] md:text-[11px] font-medium transition-all whitespace-nowrap ${
              status.isOpen 
                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}>
              <div className="relative flex items-center justify-center">
                {status.isOpen && (
                  <span className="absolute w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75"></span>
                )}
                <span className={`relative w-2 h-2 rounded-full ${status.isOpen ? "bg-green-500" : "bg-red-500"}`}></span>
              </div>
              {status.text}
            </div>
          )}
        </div>

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
