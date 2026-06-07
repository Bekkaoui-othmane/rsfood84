import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditProduitClient from './EditProduitClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function EditProduitPage({ params }: Props) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const produit = await prisma.produit.findUnique({
    where: { id },
    include: {
      ingredients: true,
      produitTags: {
        include: { tag: true },
        orderBy: { ordre: 'asc' },
      },
    },
  });
  if (!produit) notFound();

  return <EditProduitClient produit={produit} />;
}
