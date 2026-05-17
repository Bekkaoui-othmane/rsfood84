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
    if (!parsed.success) return NextResponse.json({ error: 'Données invalides', details: parsed.error.issues }, { status: 400 });

    const { ingredientsDemontables, ...autresChamps } = parsed.data;

    const produit = await prisma.produit.update({
      where: { id },
      data: {
        ...autresChamps,
        ...(ingredientsDemontables !== undefined && {
          ingredients: {
            deleteMany: { estSuppl: false },
            create: ingredientsDemontables.map(nom => ({
              nom,
              prix: 0,
              estSuppl: false,
            })),
          },
        }),
      },
    });

    return NextResponse.json(produit);
  } catch {
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
