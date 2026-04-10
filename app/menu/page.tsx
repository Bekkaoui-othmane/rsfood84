import { prisma } from '@/lib/prisma';
import MenuClient from '@/components/MenuClient';

export default async function MenuPage() {
  // Récupération des produits disponibles depuis la base de données de manière asynchrone
  const produits = await prisma.produit.findMany({
    where: { 
      disponible: true 
    },
    include: {
      ingredients: true // Récupération des ingrédients rattachés au produit
    },
    orderBy: {
      categorie: 'asc' // Regroupement alphabétique
    }
  });

  // Génération dynamique de la liste des catégories uniques à partir des produits récupérés
  const categories = [...new Set(produits.map(p => p.categorie))];

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de la page statique (Server Side Rendered) */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-outfit)]">
            Notre <span className="text-[var(--orange)]">Menu</span>
          </h1>
          <p className="text-gray-400 font-[family-name:var(--font-inter)] max-w-2xl mx-auto">
            Découvrez nos spécialités. Cliquez sur un produit pour voir les détails, le personnaliser ou choisir l&apos;option Menu (Frites + Boisson).
          </p>
        </div>

        {/* Délégation de la logique interactive (filtrage, sélection, modal) au Client Component */}
        <MenuClient produits={produits} categories={categories} />
        
      </div>
    </div>
  );
}