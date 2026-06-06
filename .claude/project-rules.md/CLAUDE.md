# CLAUDE.md — Référence projet Rs Food84
# LIS CE FICHIER EN ENTIER AVANT DE TOUCHER QUOI QUE CE SOIT

---

## 1. Contexte du projet

Site web vitrine + système de commande en ligne pour le snack **Rs Food84**.
Projet solo — BUT Informatique — Méthode Agile Scrum.
Développeur : Bekkaoui Othmane

---

## 2. Stack technique (IMMUABLE)

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 App Router |
| Langage | TypeScript strict (zéro `any`) |
| Style | Tailwind CSS (mobile-first) |
| ORM | Prisma |
| Base de données | SQLite en dev local (`file:./dev.db`), MySQL en production |
| Auth admin | NextAuth.js |
| Déploiement | Vercel |
| State panier | Zustand + persist |
| Commandes | WhatsApp uniquement (wa.me) |

---

## 3. Décisions techniques FIGÉES — ne jamais remettre en question

- ✅ **WhatsApp UNIQUEMENT** pour les commandes — pas de Stripe, pas de paiement en ligne
- ✅ **Zéro donnée en dur** dans les composants — tout vient de Prisma
- ✅ **Zéro prix côté client** — le prix est indicatif dans le tunnel, recalculé côté serveur
- ✅ **Zéro `any` TypeScript** — typer correctement tous les objets
- ✅ **Server Components** = uniquement les requêtes Prisma, jamais d'interactivité
- ✅ **Client Components** = uniquement l'interactivité, jamais de Prisma direct
- ✅ **Zustand store** = pas de prix dans `ArticlePanier`, pas de `calculerTotal()`
- ✅ **Zod** obligatoire sur toutes les routes API et tous les paramètres dynamiques
- ✅ **next/image** pour toutes les images sans exception
- ✅ Commentaires en français, variables en camelCase français, composants en PascalCase

---

## 4. Structure du projet (état réel au 13/05/2026)

```
rsfood84/
├── app/
│   ├── page.tsx                    ✅ COMPLET — accueil, vidéo, carrousel, maps
│   ├── menu/
│   │   ├── page.tsx                ✅ COMPLET — Server Component, fetch Prisma
│   │   ├── loading.tsx             ✅ COMPLET
│   │   └── error.tsx               ✅ COMPLET
│   ├── product/[id]/
│   │   ├── page.tsx                ✅ COMPLET — Server Component, Zod validation
│   │   └── ProductClientUI.tsx     ✅ COMPLET — Client Component
│   ├── contact/
│   │   └── page.tsx                ✅ COMPLET
│   ├── api/
│   │   └── checkout/
│   │       └── route.ts            ⚠️ ARTEFACT IA — contient Stripe à supprimer
│   ├── layout.tsx                  ✅ COMPLET
│   ├── globals.css                 ✅ COMPLET
│   └── providers.tsx               ✅ COMPLET
│
├── components/
│   ├── TunnelCommande.tsx          🔄 EN COURS — riz-crousty manquant
│   ├── MenuClient.tsx              ✅ COMPLET
│   ├── ProduitCard.tsx             ✅ COMPLET
│   ├── Navbar.tsx                  ⚠️ horaires à harmoniser avec contact/page.tsx
│   ├── Footer.tsx                  ✅ COMPLET
│   ├── FormulesCarousel.tsx        ⚠️ données en dur — à migrer en BDD plus tard
│   ├── GoogleMap.tsx               ✅ COMPLET
│   └── ImageModal.tsx              ✅ COMPLET
│
├── lib/
│   ├── prisma.ts                   ✅ COMPLET — singleton correct
│   ├── types.ts                    🔄 EN COURS — tailleRiz manquant dans ConfigCommande
│   ├── utils.ts                    ✅ COMPLET — mapperCategorie inclut riz-crousty
│   ├── mockData.ts                 ⚠️ ARTEFACT PARTIEL — voir section 7
│   └── whatsapp.ts                 ❌ MANQUANT — à créer
│
├── store/
│   └── panierStore.ts              ✅ COMPLET — pas de prix, pas de calculerTotal
│
├── prisma/
│   ├── schema.prisma               ✅ COMPLET
│   └── seed.ts                     🔄 EN COURS — riz crousty à ajouter
│
├── public/
│   └── images/
│       ├── Burger/                 ✅ toutes les images présentes
│       ├── Tacos/                  ✅ toutes les images présentes
│       ├── Sandwich/               ✅ toutes les images présentes
│       ├── Poutine/                ✅ toutes les images présentes
│       └── Riz/
│           ├── R_crousty.png       ✅
│           ├── R_Spicy.png         ✅
│           ├── R_Bayconaise.png    ✅
│           └── R_Truffe.png        ✅
│
└── .github/
    └── copilot-instructions.md     ✅ référence architecture générale
```

---

## 5. Pages — état et priorité

| Page | État | Priorité |
|------|-------|----------|
| `/` | ✅ Complet | — |
| `/menu` | ✅ Complet | — |
| `/product/[id]` | ✅ Complet | — |
| `/contact` | ✅ Complet | — |
| `/histoire` | ❌ Manquant | Étape 4 (après admin) |
| `/admin` | ❌ Manquant | Étape 3 |
| Modal Panier | ❌ Manquant | Étape 2 |

---

## 6. Schéma Prisma — RÉFÉRENCE OFFICIELLE

```prisma
model Produit {
  id          Int          @id @default(autoincrement())
  nom         String
  description String
  prix        Float        // ← c'est 'prix' PAS 'prixBase'
  image       String
  disponible  Boolean      @default(true)
  categorie   String
  ingredients Ingredient[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Ingredient {
  id        Int     @id @default(autoincrement())
  nom       String
  prix      Float   @default(0)
  estSuppl  Boolean @default(false)
  produitId Int
  produit   Produit @relation(fields: [produitId], references: [id], onDelete: Cascade)
}

model Admin {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
```

---

## 7. Artefacts IA à corriger — NE PAS reproduire ces patterns

### ❌ app/api/checkout/route.ts — ARTEFACT COMPLET
Ce fichier contient une intégration Stripe complète qui est un artefact de test IA.
**La décision finale est WhatsApp uniquement.**
Ce fichier doit être remplacé par une route qui :
- Reçoit les articles du panier
- Valide avec Zod (sans champ prix)
- Recalcule le prix réel depuis Prisma
- Retourne le message WhatsApp formaté + le lien wa.me
- NE DOIT PAS contenir Stripe, Redis, Upstash

### ❌ lib/mockData.ts — ARTEFACT PARTIEL
Ce fichier contient deux types de données :
- **À GARDER** : `BOISSONS`, `SAUCES`, `OPTIONS_GRATINAGE`, `VIANDES_TACOS`, `INGREDIENTS_DEMONTABLES`, `PRODUITS` — utilisés par seed.ts
- **À SUPPRIMER** : l'import de `produitsInitialData` depuis `placeholder-data` et la reconstruction de `PRODUITS` avec `INGREDIENTS_DEMONTABLES` — c'est redondant avec ce qui est en BDD
- **À TERME** : `BOISSONS`, `SAUCES`, etc. migreront en BDD via un modèle `Option` — mais PAS MAINTENANT

### ❌ Bug produitId — checkout/route.ts
`prisma.produit.findUnique({ where: { id: article.produitId } })`
`produitId` est un `String` dans le store mais Prisma attend un `Int`.
Correction : `where: { id: parseInt(article.produitId) }`

### ❌ Bug prixBase — checkout/route.ts
`produitDb.prixBase` n'existe pas — le champ Prisma s'appelle `prix`.
Correction : `produitDb.prix`

### ❌ MenuCarousel.tsx mal placé
Le fichier `public/images/Menu_formule/MenuCarousel.tsx` est un composant
React placé dans le dossier public — ce n'est pas un asset statique.
Il doit être déplacé vers `components/MenuCarousel.tsx`.

### ❌ Horaires incohérents
- `Navbar.tsx` : Mardi fermé, Mer-Lun 11h30-14h30 et 18h-23h
- `contact/page.tsx` : Lundi fermé, Mar-Sam 18h-00h, Dimanche fermé
Les vrais horaires à utiliser partout : **Mardi fermé, Mer-Lun 11h30-14h30 et 18h00-23h00**

---

## 8. Catégories produits — RÉFÉRENCE OFFICIELLE

| Catégorie en BDD | mapperCategorie() retourne | Tunnel |
|-----------------|---------------------------|--------|
| `Burgers` | `burger` | étapesBurger |
| `Sandwichs` | `burger` | étapesBurger |
| `Tacos` | `tacos` | étapesTacos |
| `Poutines` | `poutine` | étapesPoutine |
| `Formules` | `formule` | étapesFormule |
| `Riz Crousty` | `riz-crousty` | étapesRizCrousty |

---

## 9. Flux de commande — RÉFÉRENCE OFFICIELLE

```
1. Client navigue sur /menu
2. Clique sur un produit → TunnelCommande s'ouvre (modal)
3. Configure son produit étape par étape
4. "Ajouter au panier" → article ajouté dans Zustand store
5. Clique sur l'icône panier (Navbar) → Modal Panier s'ouvre
6. Dans le Modal Panier :
   - Voir le récap de tous les articles
   - Modifier un article → TunnelCommande se rouvre pré-rempli avec la config existante
   - Supprimer un article
   - Confirmer → lib/whatsapp.ts génère le message → lien wa.me s'ouvre
```

---

## 10. lib/whatsapp.ts — À CRÉER (pas encore fait)

Ce fichier doit exporter une fonction `genererLienWhatsApp(articles)` qui :
- Prend le tableau `ArticlePanier[]` depuis le store Zustand
- Génère un message texte formaté
- Retourne un lien `https://wa.me/33XXXXXXXXX?text=...` encodé

Format du message attendu :
```
Bonjour Rs Food84 ! 🍔

Voici ma commande :
- 1x Cheese Burger (sans oignon, sauce Algérienne) — prix recalculé serveur
- 1x Riz Crousty Spicy (sans sauce chili thaï, Coca-Cola) — prix recalculé serveur

Merci !
```

Le prix dans le message vient de `/api/checkout` (recalcul serveur), jamais du store.

---

## 11. Modal Panier — À CRÉER (pas encore fait)

Composant `components/Panier.tsx` :
- S'ouvre par-dessus le site (overlay/modal, pas drawer, pas page séparée)
- Design compact et élégant — cohérent avec le style dark orange existant
- Déclenché par `panierOuvert` dans le Zustand store
- Actions disponibles :
  - **Modifier** → ferme le modal, rouvre TunnelCommande avec `configInitiale` pré-remplie
  - **Supprimer** → appelle `supprimerArticle(id)` du store
  - **Confirmer** → appelle `lib/whatsapp.ts` → ouvre wa.me

Pour rouvrir le tunnel pré-rempli, passer la `config` existante de l'article
comme `configInitiale` prop à TunnelCommande, et initialiser le `useState` avec.

---

## 12. Ordre de développement — NE PAS SAUTER D'ÉTAPES

```
Étape 1 — Produits menu complets
  ✅ Riz crousty dans placeholder-data.ts (4 produits)
  ✅ Riz crousty dans INGREDIENTS_DEMONTABLES (mockData.ts)
  🔄 Riz crousty dans TunnelCommande.tsx (étapes + case)
  🔄 Relancer npx prisma db seed

Étape 2 — Nettoyage artefacts
  ❌ Remplacer checkout/route.ts (Stripe → WhatsApp)
  ❌ Corriger bug produitId String → parseInt
  ❌ Corriger bug prixBase → prix
  ❌ Déplacer MenuCarousel.tsx vers components/
  ❌ Harmoniser horaires Navbar + contact

Étape 3 — lib/whatsapp.ts
  ❌ Créer la fonction genererLienWhatsApp()

Étape 4 — Modal Panier (Panier.tsx)
  ❌ Créer le composant modal
  ❌ Brancher modifier/supprimer/confirmer
  ❌ Rouvrir tunnel pré-rempli

Étape 5 — Back-office /admin
  ❌ Login NextAuth
  ❌ CRUD produits
  ❌ CRUD options (boissons, sauces, viandes, gratinages)
  ❌ Gestion FormulesCarousel depuis BDD

Étape 6 — Page /histoire
  ❌ Créer app/histoire/page.tsx
```

---

## 13. Modèle de sécurité — RÉFÉRENCE OFFICIELLE

Le client est considéré comme **potentiellement malveillant**. Toutes les données qui transitent par le client peuvent être modifiées (localStorage, store Zustand, body de requête). La sécurité repose donc entièrement sur le serveur.

### Ce que le client peut modifier (sans impact)
- Le contenu de son `localStorage` (panier persisté Zustand)
- La quantité, les options, les ingrédients retirés dans le store
- Le body envoyé à `/api/checkout` (avec n'importe quel JSON)
- Le message WhatsApp pré-rempli avant envoi (wa.me ouvre le message en édition)

### Ce que le client ne peut PAS modifier (verrouillé serveur)

| Élément | Protection serveur |
|---------|-------------------|
| **Prix unitaire** | Recalculé depuis `prisma.produit.findUnique()`, jamais lu du client |
| **Existence du produit** | `findUnique` retourne null → erreur 400 |
| **Schéma de la requête** | Zod `.strict()` rejette tout champ non listé (notamment `prix`) |
| **Total** | Calculé serveur, retourné au client, jamais accepté du client |
| **Numéro WhatsApp destinataire** | En dur dans `lib/whatsapp.ts`, jamais paramétrable client |
| **Produits en BDD** | Pas d'API publique de modification — réservé `/admin` avec auth NextAuth |

### Règles de sécurité à respecter

- ❌ **Jamais** de prix dans le store Zustand ou dans `ArticlePanier`
- ❌ **Jamais** accepter un prix envoyé par le client dans une route API
- ❌ **Jamais** utiliser une donnée du client sans la valider avec Zod
- ❌ **Jamais** faire confiance à un ID produit sans vérification BDD
- ✅ **Toujours** recalculer le prix côté serveur depuis Prisma
- ✅ **Toujours** valider avec `.strict()` pour rejeter les champs inattendus
- ✅ **Toujours** parser un `produitId` en `Int` avant `findUnique`

### Cas du message WhatsApp

Le message WhatsApp est généré côté serveur (`/api/checkout` retourne articles + total recalculé), puis encodé dans le lien `wa.me`. Le client peut éditer ce message avant envoi — mais c'est **sans conséquence** : 
- Le message n'écrit pas en BDD
- Le snack lit le message, vérifie cohérence, confirme par téléphone si besoin
- Aucune commande automatique n'est créée à partir du message

C'est un canal de communication, pas une transaction.

---

## 14. Ce que tu NE DOIS PAS faire

- ❌ Ne jamais ajouter Stripe ou tout autre système de paiement
- ❌ Ne jamais créer de compte client ou système d'authentification côté visiteur
- ❌ Ne jamais mettre de prix dans le Zustand store ou dans ArticlePanier
- ❌ Ne jamais appeler Prisma directement depuis un Client Component
- ❌ Ne jamais utiliser `any` en TypeScript
- ❌ Ne jamais hardcoder du texte, des prix ou des noms de produits dans les composants
- ❌ Ne jamais créer de fichiers .tsx dans le dossier public/
- ❌ Ne jamais modifier schema.prisma sans créer une migration
- ❌ Ne jamais sauter une étape de l'ordre de développement ci-dessus
- ❌ Ne pas travailler sur /histoire ou /admin avant que le panier soit terminé