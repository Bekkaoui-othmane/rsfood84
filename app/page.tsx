import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { FaInstagram, FaSnapchatGhost, FaTiktok } from "react-icons/fa";
import GoogleMap from "@/components/GoogleMap";
import MenuCarousel from "@/components/MenuCarousel";
import FormulesCarousel from "@/components/FormulesCarousel";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* 0. Bannière Logo (Fond Noir) */}
      <section className="w-full bg-black flex flex-col md:flex-row items-center justify-center py-6 md:py-10 border-b border-[#1F1F1F] shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20 relative px-4 gap-6 md:gap-12">
        
        {/* Réseaux sociaux (Boutons flottants à gauche sur Desktop, empilés en haut sur Mobile) */}
        <div className="w-full md:w-auto md:absolute md:left-8 top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col justify-center gap-6 z-30">
          <a href="https://www.instagram.com/rsfood84_/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-110 shadow-lg" aria-label="Instagram">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.snapchat.com/@secours-rs" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white transition-all duration-300 hover:bg-[#FFFC00] hover:text-black hover:border-[#FFFC00] hover:scale-110 shadow-lg" aria-label="Snapchat">
            <FaSnapchatGhost size={24} />
          </a>
          <a href="https://www.tiktok.com/@rsfoood84" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-110 shadow-lg" aria-label="TikTok">
            <FaTiktok size={24} />
          </a>
        </div>

        {/* Logo Rond */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-[0_0_15px_rgba(232,93,4,0.4)] border border-[#1F1F1F]">
          <Image 
            src="/images/logo_image_pro/logo.jpg"
            alt="Logo de Rs Food84"
            fill
            sizes="(max-width: 768px) 192px, 224px"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Texte en Orange */}
        <div className="flex flex-col text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--orange)] mb-2 font-[family-name:var(--font-outfit)] tracking-wider">
            Rs Food84
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-[family-name:var(--font-inter)] font-medium">
            L&apos;excellence du Fast Food
          </p>
        </div>

        {/* Contact (Numéro et Adresse flottants à droite sur Desktop, empilés sur Mobile) */}
        <div className="w-full md:w-auto md:absolute md:right-8 top-1/2 md:-translate-y-1/2 flex flex-col justify-center items-center md:items-end gap-3 z-30">
          <a 
            href="https://maps.google.com/?q=80+Rue+de+la+Paix,+84310+Morières-lès-Avignon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-start gap-2 text-gray-300 hover:text-white font-medium font-[family-name:var(--font-inter)] text-sm md:text-base transition-colors group"
          >
            <MapPin size={18} className="text-[var(--orange)] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-right leading-snug group-hover:underline">
              80 Rue de la Paix,
              84310 <br />Morières-lès-Avignon
            </span>
          </a>
          <a href="tel:+33699569511" className="text-[var(--orange)] font-bold text-lg md:text-xl hover:underline flex items-center gap-2 transition-transform hover:scale-105">
            <Phone size={20} className="text-[var(--orange)] shrink-0" />
            <span>06 99 56 95 11</span>
          </a>
        </div>
      </section>

      {/* 0.5 Carrousel Produit */}
      <section className="w-full bg-[#0D0D0D] border-b border-[#1F1F1F]">
        <MenuCarousel />
      </section>

      {/* 1. Section Hero (Split Screen : Texte gauche / Vidéo droite) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Content (Left) */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight font-[family-name:var(--font-outfit)] leading-tight">
            Bienvenue chez <br className="hidden md:block" />
            <span className="text-[var(--orange)]">Rs Food84</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg font-[family-name:var(--font-inter)] leading-relaxed">
            Découvrez nos burgers, sandwichs et poutines préparés avec passion. 
            Commandez en ligne et venez récupérer votre repas !
          </p>
          <Link 
            href="/menu" 
            className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25 font-[family-name:var(--font-outfit)] inline-block"
          >
            Voir le Menu & Commander
          </Link>
        </div>

        {/* Video Content (Right) */}
        <div className="flex-1 w-full max-w-sm relative flex justify-center items-center z-10 mx-auto">
          {/* Lueur décorative derrière la vidéo */}
          <div className="absolute inset-0 bg-[var(--orange)]/30 blur-3xl rounded-full scale-90" />
          
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto max-h-[600px] object-cover rounded-[2rem] shadow-2xl relative z-10 border border-[var(--border-color)]"
          >
            <source src="/videos/video_riz.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
          </video>
        </div>
      </section>

      {/* 1.5 Section Carrousel Formules / Menus */}
      <section className="w-full bg-[#0D0D0D] border-t border-b border-[#1F1F1F]">
        <FormulesCarousel />
      </section>

      {/* 2. Section Informations (Horaires / Adresse) */}
      <section className="w-full max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Horaires d'ouverture */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">Nos Horaires</h2>
          <ul className="space-y-4 w-full max-w-sm text-gray-300 font-[family-name:var(--font-inter)]">
            <li className="flex justify-between items-center pb-2 border-b border-[#1F1F1F]">
              <span>Mardi</span>
              <span className="text-red-400 font-medium">Fermé</span>
            </li>
            <li className="flex justify-between items-center pb-2">
              <span>Mercredi - Lundi</span>
              <span className="text-white font-medium text-right">
                11h30 - 14h30<br/>
                18h00 - 23h00
              </span>
            </li>
          </ul>
        </div>

        {/* Adresse */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl flex flex-col items-center text-center justify-center">
          <MapPin size={48} className="text-[var(--orange)] mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-outfit)]">Notre Adresse</h2>
          <p className="text-xl text-gray-300 font-[family-name:var(--font-inter)]">
            80 Rue de la Paix<br/>
            84310 Morières-lès-Avignon
          </p>
          <a href="tel:0699569511" className="mt-6 text-lg text-[var(--orange)] font-semibold hover:underline flex items-center justify-center gap-2">
            <Phone size={24} />
            06 99 56 95 11
          </a>
        </div>
      </section>

      {/* 3. Section Google Maps */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center font-[family-name:var(--font-outfit)]">Nous Trouver</h2>
        <GoogleMap />
      </section>
    </div>
  );
}
