import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const produits = await prisma.produit.findMany({
      select: { description: true },
    });

    const tagsDescription = new Map<string, number>();
    produits.forEach(p => {
      if (!p.description) return;
      p.description.split(',').forEach(tag => {
        const t = tag.trim();
        if (t) tagsDescription.set(t, (tagsDescription.get(t) ?? 0) + 1);
      });
    });

    const suggestionsDescription = Array.from(tagsDescription.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    const ingredients = await prisma.ingredient.findMany({
      where: { estSuppl: false },
      select: { nom: true },
    });

    const tagsIngredients = new Map<string, number>();
    ingredients.forEach(i => {
      tagsIngredients.set(i.nom, (tagsIngredients.get(i.nom) ?? 0) + 1);
    });

    const suggestionsIngredients = Array.from(tagsIngredients.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([nom]) => nom);

    return NextResponse.json({
      description: suggestionsDescription,
      ingredients: suggestionsIngredients,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
