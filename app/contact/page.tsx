import { MapPin, Phone, Clock, ShoppingBag } from 'lucide-react';
import { FaInstagram, FaSnapchatGhost, FaTiktok } from 'react-icons/fa';
import GoogleMap from '@/components/GoogleMap';
import Link from 'next/link';

export const metadata = {
  title: 'Contact - Rs Food84',
  description: 'Morières-lès-Avignon : Découvrez où nous trouver et comment nous contacter.',
};

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] pt-32 pb-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Titre */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
            Nous <span className="text-[var(--orange)]">Contacter</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-[family-name:var(--font-inter)] leading-relaxed">
            Une question, une commande spéciale ou juste envie de nous dire bonjour ? 
            Retrouvez-nous facilement à Morières-lès-Avignon !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Informations Contact */}
          <div className="flex flex-col gap-8 w-full order-2 lg:order-1">
            <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl font-bold text-white mb-8 font-[family-name:var(--font-outfit)] border-b border-[#1F1F1F] pb-4">
                Nos Coordonnées
              </h2>
              
              <div className="flex flex-col gap-8">
                {/* Ligne Adresse */}
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 bg-[var(--orange)]/10 rounded-2xl flex items-center justify-center text-[var(--orange)] shrink-0 border border-[var(--orange)]/20 shadow-[0_0_15px_rgba(232,93,4,0.1)]">
                    <MapPin size={28} />
                  </div>
                  <div className="flex flex-col pt-1">
                    <h3 className="text-white text-lg font-bold mb-1">Adresse</h3>
                    <a 
                      href="https://maps.app.goo.gl/A46w5jL8K4sLgTEx5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[var(--orange)] transition-colors leading-relaxed"
                    >
                      80 Rue de la Paix <br />
                      84310 Morières-lès-Avignon
                    </a>
                  </div>
                </div>

                {/* Ligne Téléphone */}
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 bg-[var(--orange)]/10 rounded-2xl flex items-center justify-center text-[var(--orange)] shrink-0 border border-[var(--orange)]/20 shadow-[0_0_15px_rgba(232,93,4,0.1)]">
                    <Phone size={28} />
                  </div>
                  <div className="flex flex-col pt-1">
                    <h3 className="text-white text-lg font-bold mb-1">Téléphone</h3>
                    <a href="tel:+33699569511" className="text-gray-400 hover:text-[var(--orange)] transition-colors text-lg">
                      06 99 56 95 11
                    </a>
                    <span className="text-sm text-gray-500 mt-1">Appelez-nous pour commander</span>
                  </div>
                </div>

                {/* Ligne Horaires */}
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 bg-[var(--orange)]/10 rounded-2xl flex items-center justify-center text-[var(--orange)] shrink-0 border border-[var(--orange)]/20 shadow-[0_0_15px_rgba(232,93,4,0.1)]">
                    <Clock size={28} />
                  </div>
                  <div className="flex flex-col pt-1">
                    <h3 className="text-white text-lg font-bold mb-1">Horaires d&apos;Ouverture</h3>
                    <ul className="text-gray-400 space-y-2 mt-2">
                      <li className="flex justify-between w-48 border-b border-[#333] pb-1">
                        <span>Lundi :</span> <span className="text-[#E85D04]">Fermé</span>
                      </li>
                      <li className="flex justify-between w-48 border-b border-[#333] pb-1">
                        <span>Mar. - Sam. :</span> <span>18:00 - 00:00</span>
                      </li>
                      <li className="flex justify-between w-48 pt-1">
                        <span>Dimanche :</span> <span className="text-[#E85D04]">Fermé</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Nouveau Bloc Réseaux Sociaux */}
            <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl font-bold text-white mb-8 font-[family-name:var(--font-outfit)] border-b border-[#1F1F1F] pb-4">
                Nos Réseaux Sociaux
              </h2>
              
              <div className="flex flex-col gap-4">
                <a href="https://www.instagram.com/rsfood84_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 bg-[#1A1A1A] border border-[#222] p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:shadow-[0_5px_20px_rgba(219,39,119,0.15)] group">
                  <div className="w-14 h-14 rounded-2xl bg-[#222] flex items-center justify-center text-white transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FaInstagram size={30} className="z-10 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] transition-colors text-xl">Instagram</span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-400">@rsfood84_</span>
                  </div>
                </a>

                <a href="https://www.snapchat.com/@secours-rs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 bg-[#1A1A1A] border border-[#222] p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFFC00] hover:shadow-[0_5px_20px_rgba(255,252,0,0.1)] group">
                  <div className="w-14 h-14 rounded-2xl bg-[#222] flex items-center justify-center text-white transition-all duration-300 relative overflow-hidden group-hover:bg-[#FFFC00]">
                    <FaSnapchatGhost size={30} className="z-10 group-hover:text-black" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-300 group-hover:text-[#FFFC00] transition-colors text-xl">Snapchat</span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-400">@secours-rs</span>
                  </div>
                </a>

                <a href="https://www.tiktok.com/@rsfoood84" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 bg-[#1A1A1A] border border-[#222] p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_5px_20px_rgba(34,211,238,0.1)] group">
                  <div className="w-14 h-14 rounded-2xl bg-[#222] flex items-center justify-center text-white transition-all duration-300 relative overflow-hidden group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-pink-500">
                    <FaTiktok size={30} className="z-10 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-xl relative inline-block">
                      TikTok
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-400">@rsfoood84</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Carte Google Map & Formulaire Rapide */}
          <div className="flex flex-col gap-8 w-full order-1 lg:order-2">
            {/* Composant de Carte Déjà existant */}
            <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-3xl p-4 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-bold text-white mb-6 ml-2 font-[family-name:var(--font-outfit)] flex items-center gap-2">
                 Plan d&apos;accès <MapPin size={20} className="text-[var(--orange)]" />
              </h2>
              <div className="rounded-2xl overflow-hidden shadow-inner h-[380px]">
                <GoogleMap />
              </div>
            </div>

             {/* Carte appel à l'action */}
             <div className="bg-gradient-to-br from-[var(--orange)] to-[#cc5203] rounded-3xl p-8 relative overflow-hidden shadow-[0_15px_50px_rgba(232,93,4,0.4)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <h3 className="text-2xl font-bold text-white mb-3">Prêt à commander ?</h3>
                <p className="text-white/90 mb-6 max-w-sm">Ne perdez pas de temps, appelez-nous directement pour récupérer votre commande bien chaude.</p>
                  <div className="flex flex-wrap gap-4">
                    <a href="tel:+33699569511" className="inline-flex items-center justify-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 hover:bg-gray-100 transition-all flex-grow md:flex-grow-0">
                      <Phone size={20} className="text-[var(--orange)]" /> Appeler le 06 99 56 95 11
                    </a>
                      <Link href="/menu" className="inline-flex items-center justify-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 hover:bg-gray-100 transition-all flex-grow md:flex-grow-0">
                        <ShoppingBag size={20} className="text-[var(--orange)]" /> Faire son panier
                    </Link>
                  </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}