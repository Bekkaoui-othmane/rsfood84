import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

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
  return (
    <Link href={`/product/${produit.id}`} className="group block h-full">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--orange)] hover:shadow-[0_0_20px_rgba(232,93,4,0.3)] hover:-translate-y-1 h-full flex flex-col">
        {/* Image du produit */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-black flex items-center justify-center">
          <Image
            src={produit.image}
            alt={produit.nom}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay dégradé */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </div>

        {/* Détails du produit */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-outfit)]">
              {produit.nom}
            </h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-6 flex-grow font-[family-name:var(--font-inter)] line-clamp-2">
            {produit.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-[var(--orange)]">
              {produit.prix.toFixed(2)}€
            </span>
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-white transition-colors duration-300 group-hover:bg-[var(--orange)] group-hover:border-[var(--orange)]">
              <ShoppingBag size={18} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}