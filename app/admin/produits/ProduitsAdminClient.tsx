'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Produit, Ingredient } from '@prisma/client';

type ProduitAvecIngredients = Produit & { ingredients: Ingredient[] };

interface Props {
  produits: ProduitAvecIngredients[];
}

export default function ProduitsAdminClient({ produits }: Props) {
  const router = useRouter();
  const [filtre, setFiltre] = useState<string>('Tous');

  const categories = ['Tous', ...Array.from(new Set(produits.map(p => p.categorie)))];

  const produitsFiltres = filtre === 'Tous'
    ? produits
    : produits.filter(p => p.categorie === filtre);

  const toggleDisponible = async (id: number, disponible: boolean) => {
    await fetch(`/api/admin/produits/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible: !disponible }),
    });
    router.refresh();
  };

  const supprimer = async (id: number, nom: string) => {
    if (!confirm(`Supprimer définitivement "${nom}" ?`)) return;

    await fetch(`/api/admin/produits/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <>
      {/* Filtres catégories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltre(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filtre === cat
                ? 'bg-[var(--orange)] text-white'
                : 'bg-[#1A1A1A] text-gray-400 border border-[#333] hover:border-[var(--orange)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A] border-b border-[#1F1F1F]">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Image</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Nom</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Catégorie</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Prix</th>
              <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">Statut</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {produitsFiltres.map(produit => (
              <tr
                key={produit.id}
                className="border-b border-[#1F1F1F] last:border-b-0 hover:bg-[#0A0A0A] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0">
                    {produit.image && (
                      <Image
                        src={produit.image}
                        alt={produit.nom}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-white font-medium">{produit.nom}</td>
                <td className="px-6 py-4 text-gray-400">{produit.categorie}</td>
                <td className="px-6 py-4 text-right text-[var(--orange)] font-bold">
                  {produit.prix.toFixed(2)}€
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleDisponible(produit.id, produit.disponible)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      produit.disponible
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                    }`}
                  >
                    {produit.disponible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {produit.disponible ? 'Visible' : 'Masqué'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/produits/${produit.id}`}
                      className="p-2 rounded-lg bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-[var(--orange)] hover:border-[var(--orange)] transition-colors"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => supprimer(produit.id, produit.nom)}
                      className="p-2 rounded-lg bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-red-400 hover:border-red-500/50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {produitsFiltres.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            Aucun produit dans cette catégorie.
          </div>
        )}
      </div>
    </>
  );
}
