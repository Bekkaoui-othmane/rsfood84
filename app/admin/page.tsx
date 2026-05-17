import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Package, Tags, Image as ImageIcon, TrendingUp, EyeOff, Eye, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalProduits = await prisma.produit.count();
  const produitsVisibles = await prisma.produit.count({ where: { disponible: true } });
  const produitsMasques = totalProduits - produitsVisibles;

  const prixMoyenResult = await prisma.produit.aggregate({ _avg: { prix: true } });
  const prixMoyen = prixMoyenResult._avg.prix ?? 0;

  const produitsParCategorie = await prisma.produit.groupBy({
    by: ['categorie'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  const derniersAjouts = await prisma.produit.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, nom: true, categorie: true, prix: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
      <p className="text-gray-400 mb-8">Vue d&apos;ensemble de Rs Food84</p>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Package size={24} />} label="Total produits" value={totalProduits} color="orange" />
        <StatCard icon={<Eye size={24} />} label="Produits visibles" value={produitsVisibles} color="green" />
        <StatCard icon={<EyeOff size={24} />} label="Produits masqués" value={produitsMasques} color="red" />
        <StatCard icon={<DollarSign size={24} />} label="Prix moyen" value={`${prixMoyen.toFixed(2)}€`} color="blue" />
      </div>

      {/* Sections cliquables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SectionCard
          href="/admin/produits"
          icon={<Package size={32} />}
          title="Produits"
          description={`${totalProduits} produits à gérer`}
        />
        <SectionCard
          href="/admin/tags"
          icon={<Tags size={32} />}
          title="Tags"
          description="Gérer les ingrédients réutilisables"
        />
        <SectionCard
          href="/admin/carrousel"
          icon={<ImageIcon size={32} />}
          title="Carrousel"
          description="Modifier les formules en vedette"
        />
      </div>

      {/* Répartition + Derniers ajouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-[var(--orange)]" />
            Par catégorie
          </h2>
          <div className="space-y-3">
            {produitsParCategorie.map(cat => (
              <div key={cat.categorie} className="flex justify-between items-center">
                <span className="text-gray-300">{cat.categorie}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--orange)] rounded-full"
                      style={{ width: `${(cat._count.id / totalProduits) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-bold w-8 text-right">{cat._count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Derniers produits ajoutés</h2>
          <div className="space-y-2">
            {derniersAjouts.map(p => (
              <Link
                key={p.id}
                href={`/admin/produits/${p.id}`}
                className="flex justify-between items-center p-3 rounded-xl hover:bg-[#1A1A1A] transition-colors"
              >
                <div>
                  <p className="text-white font-medium">{p.nom}</p>
                  <p className="text-gray-500 text-xs">{p.categorie}</p>
                </div>
                <span className="text-[var(--orange)] font-bold">{p.prix.toFixed(2)}€</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, color,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: 'orange' | 'green' | 'red' | 'blue';
}) {
  const colorClasses = {
    orange: 'bg-[var(--orange)]/10 border-[var(--orange)]/30 text-[var(--orange)]',
    green:  'bg-green-500/10 border-green-500/30 text-green-400',
    red:    'bg-red-500/10 border-red-500/30 text-red-400',
    blue:   'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-2xl p-6">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function SectionCard({
  href, icon, title, description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-[var(--bg-card)] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[var(--orange)] transition-all group"
    >
      <div className="w-14 h-14 rounded-xl bg-[var(--orange)]/10 border border-[var(--orange)]/30 text-[var(--orange)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--orange)] transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
}
