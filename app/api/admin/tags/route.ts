import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const createSchema = z.object({
  nom: z.string().min(1).max(100),
}).strict();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const existing = await prisma.tag.findUnique({ where: { nom: parsed.data.nom } });
    if (existing) {
      return NextResponse.json(
        { error: `Un tag "${parsed.data.nom}" existe déjà` },
        { status: 409 }
      );
    }

    const tag = await prisma.tag.create({ data: { nom: parsed.data.nom } });
    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
