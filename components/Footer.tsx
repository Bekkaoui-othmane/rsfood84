import { MapPin, Phone, Mail } from 'lucide-react';
import { FaInstagram, FaSnapchatGhost, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#1F1F1F] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Colonne 1 — Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin size={16} className="text-[var(--orange)] mt-1 shrink-0" />
                <span className="leading-snug">
                  80 Rue de la Paix,<br />
                  84310 Morières-lès-Avignon
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone size={16} className="text-[var(--orange)] shrink-0" />
                <span>06 99 56 95 11</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail size={16} className="text-[var(--orange)] shrink-0" />
                <span>contact@rsfood84.fr</span>
              </li>
            </ul>
          </div>

          {/* Colonne 2 — Horaires */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Horaires</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-300">Mardi</span>
                <span className="text-red-400">Fermé</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-300">Mercredi - Lundi</span>
                <span className="text-white text-right">
                  11h30 – 14h30<br/>
                  18h00 – 23h00
                </span>
              </li>
            </ul>
          </div>

          {/* Colonne 3 — Suivez-nous */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Suivez-nous</h3>
            <div className="flex gap-4 mb-4">
              <a 
                href="https://www.instagram.com/rsfood84_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://www.snapchat.com/@secours-rs" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white transition-all duration-300 hover:bg-[#FFFC00] hover:text-black hover:scale-110"
                aria-label="Snapchat"
              >
                <FaSnapchatGhost size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@rsfoood84" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white transition-all duration-300 hover:bg-white hover:text-black hover:scale-110"
                aria-label="TikTok"
              >
                <FaTiktok size={18} />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Partagez vos moments avec nous <span className="text-[var(--orange)] font-medium">#RsFood84</span>
            </p>
          </div>
          
        </div>

        {/* Ligne Copyright */}
        <div className="border-t border-[#1F1F1F] pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Rs Food84. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
