import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  nom: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  prix: z.number().positive().optional(),
  categorie: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  disponible: z.boolean().optional(),
  ingredientsDemontables: z.array(z.string()).optional(),
}).strict();

async function relierTags(
  produitId: number,
  noms: string[],
  type: 'description' | 'ingredient_demontable'
) {
  await prisma.produitTag.deleteMany({ where: { produitId, type } });

  for (let i = 0; i < noms.length; i++) {
    const tag = await prisma.tag.findUnique({ where: { nom: noms[i] } });
    if (!tag) throw new Error(`Tag "${noms[i]}" introuvable — crée-le dans /admin/tags`);
    await prisma.produitTag.create({
      data: { produitId, tagId: tag.id, type, ordre: i },
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { description, ingredientsDemontables, ...campsScalaires } = parsed.data;

    const produit = await prisma.produit.update({
      where: { id },
      data: {
        ...campsScalaires,
        ...(description !== undefined && { description }),
      },
    });

    if (description !== undefined) {
      const tags = description.split(',').map(t => t.trim()).filter(Boolean);
      await relierTags(id, tags, 'description');
    }

    if (ingredientsDemontables !== undefined) {
      await relierTags(id, ingredientsDemontables, 'ingredient_demontable');
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });

  try {
    await prisma.produit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
