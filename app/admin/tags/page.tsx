import { prisma } from '@/lib/prisma';
import TagsAdminClient from './TagsAdminClient';

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { produits: true } },
    },
    orderBy: [{ actif: 'desc' }, { nom: 'asc' }],
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Gestion des Tags</h1>
        <p className="text-gray-400">
          {tags.length} tags utilisés dans vos produits.
          Renommer un tag le met à jour partout.
          Désactiver un tag = affichage barré côté client (rupture de stock).
        </p>
      </div>

      <TagsAdminClient tags={tags} />
    </div>
  );
}
