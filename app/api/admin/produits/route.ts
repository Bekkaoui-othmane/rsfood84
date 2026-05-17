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
      data: {
        ...champsProduit,
        disponible: true,
        ingredients: {
          create: (ingredientsDemontables ?? []).map(nom => ({
            nom,
            prix: 0,
            estSuppl: false,
          })),
        },
      },
    });

    return NextResponse.json(produit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
