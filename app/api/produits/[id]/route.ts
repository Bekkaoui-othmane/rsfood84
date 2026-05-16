import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idSchema = z.coerce.number().int().positive();
  const parsed = idSchema.safeParse(params.id);

  if (!parsed.success) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }

  const produit = await prisma.produit.findUnique({
    where: { id: parsed.data },
    include: { ingredients: true },
  });

  if (!produit) {
    return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  }

  return NextResponse.json(produit);
}
