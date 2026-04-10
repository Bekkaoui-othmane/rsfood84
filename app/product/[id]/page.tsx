import { notFound } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import ProductClientUI from './ProductClientUI';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Validation stricte de l'ID passé en paramètre
  const idSchema = z.coerce.number().int().positive();
  const parsed = idSchema.safeParse(params.id);
  
  if (!parsed.success) {
    notFound();
  }

  // Récupération en base de données du produit et de ses ingrédients attachés
  const produit = await prisma.produit.findUnique({
    where: { id: parsed.data },
    include: { ingredients: true }
  });

  if (!produit) {
    notFound();
  }

  // Rendu du composant client interne (pour gérer les modales) avec les données vérifiées de Prisma
  return <ProductClientUI produit={produit} />;
}
