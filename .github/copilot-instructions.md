# Copilot Instructions — Site Rs Food84

## Contexte du projet
Tu travailles sur le site web vitrine et système de commande en ligne du snack **Rs Food84**.
Projet réalisé en solo dans le cadre d'un **BUT Informatique**, en méthode Agile.
Le développeur connaît React, JavaScript, PHP et les ORM (Prisma en local).

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| ORM | Prisma |
| Base de données | MySQL (PlanetScale en prod) |
| Authentification admin | NextAuth.js |
| Déploiement | Vercel |
| Versioning | Git / GitHub |

---

## Structure du projet

```
rsfood84/
├── .github/
│   └── copilot-instructions.md   ← tu es ici
├── app/
│   ├── page.tsx                  ← page d'accueil (vidéo background)
│   ├── menu/
│   │   └── page.tsx              ← grille produits
│   ├── product/
│   │   └── [id]/page.tsx         ← fiche détail produit
│   ├── panier/
│   │   └── page.tsx              ← récapitulatif commande
│   ├── about/
│   │   └── page.tsx              ← page À propos
│   ├── contact/
│   │   └── page.tsx              ← page Contact
│   └── admin/
│       ├── page.tsx              ← dashboard admin
│       └── produits/page.tsx     ← gestion CRUD produits
├── api/
│   ├── produits/route.ts         ← GET / POST produits
│   ├── produits/[id]/route.ts    ← PUT / DELETE produit
│   └── auth/[...nextauth]/       ← authentification admin
├── components/
│   ├── ProduitCard.tsx           ← carte produit cliquable
│   ├── Panier.tsx                ← composant panier
│   ├── WhatsAppButton.tsx        ← génération lien wa.me
│   ├── Carrousel.tsx             ← carrousel images
│   └── GoogleMap.tsx             ← embed Google Maps
├── lib/
│   ├── prisma.ts                 ← client Prisma singleton
│   └── whatsapp.ts               ← logique génération message
├── prisma/
│   └── schema.prisma             ← schéma base de données
└── public/
    └── videos/                   ← vidéo background accueil
```

---

## Schéma base de données (Prisma)

```prisma
model Produit {
  id           Int      @id @default(autoincrement())
  nom          String
  description  String
  prix         Float
  image        String
  disponible   Boolean  @default(true)
  categorie    String
  ingredients  Ingredient[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Ingredient {
  id        Int     @id @default(autoincrement())
  nom       String
  prix      Float   @default(0)
  estSuppl  Boolean @default(false)
  produitId Int
  produit   Produit @relation(fields: [produitId], references: [id])
}

model Admin {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
```

---

## Fonctionnalités principales

### 1. Page d'accueil
- Vidéo en arrière-plan (autoplay, loop, muted)
- Bouton CTA qui redirige vers `/menu`
- Section adresse + embed Google Maps en bas de page
- Horaires d'ouverture

### 2. Menu / catalogue
- Grille responsive de `ProduitCard`
- Chaque carte : photo, nom, prix
- Clic → page `/product/[id]`
- Produits indisponibles grisés et non cliquables

### 3. Fiche produit
- Photo, nom, description, prix de base
- Boutons `+` / `−` pour chaque ingrédient
- Les suppléments (`estSuppl: true`) ajoutent leur prix au total
- Les retraits sont gratuits et notés (ex: "sans moutarde")
- Bouton "Ajouter au panier"

### 4. Panier & WhatsApp
- State global (React Context ou Zustand)
- Récapitulatif avec toutes les personnalisations
- Calcul automatique du total
- Bouton qui génère un lien `wa.me` avec message pré-rempli

### Format du message WhatsApp
```
Bonjour Rs Food84 ! 🍔

Voici ma commande :
- 1x Cheese Burger (sans moutarde, +cheddar supplémentaire) — 8.50€
- 1x Coca Cola — 2.00€

Total : 10.50€

Merci !
```

### 5. Back-office admin
- Accès via `/admin` protégé par NextAuth.js
- CRUD complet des produits
- Toggle disponible / indisponible
- Upload photo produit

---

## Règles de code à respecter

### Général
- Toujours utiliser **TypeScript** avec des types explicites
- Pas de `any` — typer correctement tous les objets
- Commentaires en **français**
- Noms de variables et fonctions en **camelCase** en français (ex: `ajouterAuPanier`, `prixTotal`)
- Noms de composants en **PascalCase** (ex: `ProduitCard`, `BoutonWhatsApp`)

### Next.js / React
- Utiliser l'**App Router** de Next.js 14 (pas le Pages Router)
- Préférer les **Server Components** par défaut
- Utiliser `'use client'` uniquement quand nécessaire (interactions, state)
- Les appels BDD se font **uniquement côté serveur** (Server Components ou API Routes)
- Utiliser `loading.tsx` et `error.tsx` pour chaque route

### Prisma
- Toujours importer le client depuis `@/lib/prisma`
- Ne jamais instancier `new PrismaClient()` directement dans les composants
- Utiliser `prisma.$transaction()` pour les opérations multiples

### Tailwind CSS
- Utiliser Tailwind pour tout le style — pas de CSS inline sauf exception
- Responsive : mobile-first (`sm:`, `md:`, `lg:`)
- Le site doit être parfaitement utilisable sur mobile (commandes WhatsApp = mobile)

### Sécurité
- Toutes les routes `/api/admin/*` doivent vérifier la session NextAuth
- Ne jamais exposer le mot de passe admin dans le client
- Valider toutes les entrées utilisateur côté serveur (Zod recommandé)
- Variables d'environnement dans `.env.local` — jamais en dur dans le code

### Performance
- Optimiser les images avec `next/image`
- La vidéo d'accueil doit être compressée (< 10 Mo)
- Lazy loading sur les images du menu

---

## Variables d'environnement (.env.local)

```env
DATABASE_URL="mysql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
WHATSAPP_NUMBER="33XXXXXXXXX"
GOOGLE_MAPS_API_KEY="..."
```

---

## Commandes utiles

```bash
# Démarrer en dev
npm run dev

# Générer le client Prisma après modif du schéma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Ouvrir Prisma Studio (interface BDD visuelle)
npx prisma studio

# Build production
npm run build

# Déployer sur Vercel
vercel --prod
```

---

## Points d'attention

- La commande WhatsApp est la fonctionnalité **la plus critique** — bien tester sur iOS et Android
- Le site doit fonctionner **sans compte client** (pas d'authentification côté client)
- Seul le gérant a un compte (espace admin)
- Les produits indisponibles doivent être **visibles mais non commandables**
- Penser à la **touche mobile** : boutons larges, images optimisées, navigation simple

---

*Projet Rs Food84 — BUT Informatique — Stage 30/03/2025 au 19/07/2025*