import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const produitSchema = z.object({
  nom: z.string().min(1).max(100),
  description: z.string().max(500),
  prix: z.number().positive(),
  categorie: z.string().min(1),
  image: z.string().min(1),
  ingredientsDemontables: z.array(z.string()).optional(),
}).strict();

async function lierTags(
  produitId: number,
  noms: string[],
  type: 'description' | 'ingredient_demontable'
) {
  for (let i = 0; i < noms.length; i++) {
    const tag = await prisma.tag.findUnique({ where: { nom: noms[i] } });
    if (!tag) throw new Error(`Tag "${noms[i]}" introuvable — crée-le dans /admin/tags`);
    await prisma.produitTag.create({
      data: { produitId, tagId: tag.id, type, ordre: i },
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = produitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const { ingredientsDemontables, ...champsProduit } = parsed.data;

    const produit = await prisma.produit.create({
      data: { ...champsProduit, disponible: true },
    });

    // Lier les tags de description
    const tagsDescription = parsed.data.description
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    await lierTags(produit.id, tagsDescription, 'description');

    // Lier les ingrédients démontables
    if (ingredientsDemontables?.length) {
      await lierTags(produit.id, ingredientsDemontables, 'ingredient_demontable');
    }

    return NextResponse.json(produit);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Tag "')) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
