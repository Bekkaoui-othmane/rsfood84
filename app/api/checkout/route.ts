import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Aucun champ 'prix' déclaré — .strict() rejette tout champ non listé
const configSchema = z.object({
  avecFritesBoisson: z.boolean(),
  gratinage: z.string().nullable(),
  fritesFromage: z.boolean(),
  sauce: z.string().nullable(),
  boisson1: z.string().nullable(),
  boisson2: z.string().nullable(),
  ingredientsRetires: z.array(z.string()),
  nbViandes: z.number().nullable(),
  viandes: z.array(z.string()),
  taillePoutine: z.enum(['L', 'XL']).nullable(),
  burgersFormule: z.array(z.object({
    nomBurger: z.string(),
    ingredientsRetires: z.array(z.string()),
    gratinage: z.string().nullable()
  }))
}).strict();

const checkoutSchema = z.object({
  articles: z.array(z.object({
    produitId: z.string(),
    quantite: z.number().int().min(1, "Quantité minimum 1").max(20, "Quantité maximum 20"),
    config: configSchema
  })).min(1, "Le panier ne peut pas être vide")
}).strict();

type ArticleCalcule = {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  options: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = checkoutSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Format corrompu ou champ non autorisé détecté:", parseResult.error);
      return NextResponse.json({ error: "Format invalide ou données altérées." }, { status: 400 });
    }

    const { articles } = parseResult.data;
    const articlesCalcules: ArticleCalcule[] = [];
    let total = 0;

    for (const article of articles) {
      // produitId est un String dans le store Zustand, Prisma attend un Int
      const produitDb = await prisma.produit.findUnique({
        where: { id: parseInt(article.produitId) }
      });

      if (!produitDb) {
        return NextResponse.json(
          { error: `Produit introuvable ou supprimé : ${article.produitId}` },
          { status: 400 }
        );
      }

      // Le prix de base vient de Prisma (champ 'prix', jamais du client)
      let prixUnitaire = produitDb.prix;
      const options: string[] = [];

      if (article.config.avecFritesBoisson) { prixUnitaire += 2.00; options.push('Menu Frites + Boisson'); }
      if (article.config.gratinage)         { prixUnitaire += 2.00; options.push(`Gratiné ${article.config.gratinage}`); }
      if (article.config.fritesFromage)     { prixUnitaire += 2.00; options.push('Frites Cheddar Bacon'); }
      if (article.config.taillePoutine === 'XL') { prixUnitaire += 2.00; options.push('Taille XL'); }
      if (article.config.boisson1 && !article.config.avecFritesBoisson) {
        prixUnitaire += 2.00;
        options.push(article.config.boisson1);
      }
      if (article.config.boisson2) { prixUnitaire += 2.00; options.push(article.config.boisson2); }
      if (article.config.sauce)    { options.push(`Sauce ${article.config.sauce}`); }

      article.config.ingredientsRetires.forEach(ing => options.push(`Sans ${ing}`));

      articlesCalcules.push({
        nom: produitDb.nom,
        quantite: article.quantite,
        prixUnitaire,
        options,
      });

      total += prixUnitaire * article.quantite;
    }

    return NextResponse.json({ articles: articlesCalcules, total: Math.round(total * 100) / 100 });

  } catch (error) {
    console.error('Erreur API Checkout :', error);
    return NextResponse.json({ error: "Erreur interne serveur." }, { status: 500 });
  }
}
