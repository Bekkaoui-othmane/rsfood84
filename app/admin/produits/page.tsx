import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProduitsAdminClient from './ProduitsAdminClient';

export const dynamic = 'force-dynamic';

export default async function ProduitsAdminPage() {
  const produits = await prisma.produit.findMany({
    include: { ingredients: true },
    orderBy: [{ categorie: 'asc' }, { nom: 'asc' }],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
            Gestion des Produits
          </h1>
          <p className="text-gray-400 mt-1">{produits.length} produits au total</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Ajouter un produit
        </Link>
      </div>

      <ProduitsAdminClient produits={produits} />
    </div>
  );
}
