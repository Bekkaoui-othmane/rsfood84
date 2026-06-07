import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const tags = await prisma.tag.findMany({
      where: { actif: true },
      select: { nom: true, _count: { select: { produits: true } } },
    });

    const sortedNoms = tags
      .sort((a, b) => b._count.produits - a._count.produits || a.nom.localeCompare(b.nom))
      .map(t => t.nom);

    return NextResponse.json({
      description: sortedNoms,
      ingredients: sortedNoms,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
