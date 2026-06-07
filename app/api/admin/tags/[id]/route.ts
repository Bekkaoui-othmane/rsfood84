import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  nom: z.string().min(1).max(100).optional(),
  actif: z.boolean().optional(),
}).strict();

async function regenererDescriptions(produitIds: number[]) {
  for (const produitId of produitIds) {
    const tagsDuProduit = await prisma.produitTag.findMany({
      where: { produitId, type: 'description' },
      include: { tag: true },
      orderBy: { ordre: 'asc' },
    });

    await prisma.produit.update({
      where: { id: produitId },
      data: { description: tagsDuProduit.map(pt => pt.tag.nom).join(', ') },
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

    // Vérifier l'unicité du nouveau nom avant de renommer
    if (parsed.data.nom) {
      const existing = await prisma.tag.findUnique({ where: { nom: parsed.data.nom } });
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: `Un tag "${parsed.data.nom}" existe déjà` },
          { status: 409 }
        );
      }
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: parsed.data,
    });

    // Propagation du renommage dans Produit.description
    if (parsed.data.nom) {
      const produitIds = await prisma.produitTag
        .findMany({ where: { tagId: id, type: 'description' }, select: { produitId: true } })
        .then(rows => Array.from(new Set(rows.map(r => r.produitId))));

      await regenererDescriptions(produitIds);
    }

    return NextResponse.json(tag);
  } catch (error) {
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
    // Récupérer les produits affectés AVANT la suppression (cascade efface ProduitTag)
    const produitIds = await prisma.produitTag
      .findMany({ where: { tagId: id, type: 'description' }, select: { produitId: true } })
      .then(rows => Array.from(new Set(rows.map(r => r.produitId))));

    await prisma.tag.delete({ where: { id } });

    // Régénérer les descriptions sans ce tag
    await regenererDescriptions(produitIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
