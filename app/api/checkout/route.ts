import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma'; // 1. Utilisation du singleton Prisma existant au lieu de new PrismaClient()
import Stripe from 'stripe';
import { Ratelimit } from '@upstash/ratelimit'; // 3. Import du limiteur de requêtes
import { Redis } from '@upstash/redis'; // 3. Import du client Redis

// Instanciation de Stripe (Nécessite STRIPE_SECRET_KEY dans le .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  // 2. Suppression stricte de "as any". L'API version doit correspondre au typage du SDK Stripe.
  // Une version typique et sûre est la date la plus récente fournie par l'auto-complétion du SDK.
  apiVersion: '2023-10-16', 
});

// --- 1. RATE LIMITING (Upstash Redis) ---
// Crée une instance Redis à partir des variables d'environnement locales
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Instanciation du Rate Limiter (limite stricte à 5 requêtes par minute)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
});

// --- 2. SCHÉMAS ZOD STRICTS (Zero Trust) ---
// Aucun champ 'prix' n'est déclaré ici. `.strict()` rejettera toute requête contenant un prix.
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

export async function POST(req: NextRequest) {
  try {
    // --- VÉRIFICATION DU RATE LIMITING ---
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() 
               ?? req.headers.get('x-real-ip') 
               ?? 'anonymous';
    
    // Application de la limitation via Upstash Redis
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      // Bloque l'exécution avec statut 429 "Too Many Requests" et arrête l'appel
      return NextResponse.json({ error: "Trop de requêtes, veuillez patienter (Max 5/min)." }, { status: 429 });
    }

    // --- VALIDATION NEXTAUTH DÉSACTIVÉE ---
    // -> Conformément aux consignes, les clients sont des invités. Pas de vérification de session ici.

    // --- VALIDATION ZOD STRICTE ---
    const body = await req.json();
    const parseResult = checkoutSchema.safeParse(body);
    
    if (!parseResult.success) {
      console.error("Format corrompu ou champ non autorisé détecté:", parseResult.error);
      return NextResponse.json({ error: "Format invalide ou données altérées." }, { status: 400 });
    }
    
    const { articles } = parseResult.data;

    // --- RECALCUL DU PRIX CÔTÉ SERVEUR (PRISMA) ---
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const article of articles) {
      // Récupération stricte depuis la Base de Données
      // On s'assure que le produitId n'est pas inventé et on récupère le vrai prix
      const produitDb = await prisma.produit.findUnique({
        where: { id: article.produitId } 
      });

      if (!produitDb) {
        return NextResponse.json({ error: `Produit introuvable ou supprimé: ${article.produitId}` }, { status: 400 });
      }

      // Le prix unitaire de base provient de Prisma, JAMAIS du client
      let prixUnitaireReel = produitDb.prixBase;
      
      // Ajout dynamique des suppléments basés sur la configuration validée
      // (Brouillon logique: à affiner avec les vrais tarifs en base)
      if (article.config.avecFritesBoisson) prixUnitaireReel += 2.00;
      if (article.config.gratinage) prixUnitaireReel += 2.00;
      if (article.config.fritesFromage) prixUnitaireReel += 2.00;
      if (article.config.taillePoutine === 'XL') prixUnitaireReel += 2.00;
      // TODO: Ajouter Tenders viandes, 2eme boisson, etc.
      
      // Ajout de l'article à la facture Stripe
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: produitDb.nom,
            // Petite description des options pour le ticket Stripe
            description: `Quantité: ${article.quantite}x - Options: ${article.config.sauce || 'Sans sauce'}, ...`,
          },
          unit_amount: Math.round(prixUnitaireReel * 100), // Stripe demande des centimes
        },
        quantity: article.quantite,
      });
    }

    // --- CRÉATION DE LA SESSION STRIPE ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/panier`,
    });

    // --- RÉPONSE ---
    // On retourne uniquement l'URL dynamique Stripe au client
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Erreur API Checkout :', error);
    return NextResponse.json({ error: "Erreur interne serveur." }, { status: 500 });
  }
}