import { prisma } from '../lib/prisma'; // Remplacé par '../' car ts-node ne résout pas '@/' nativement sans configuration supplémentaire
import { PRODUITS } from '../lib/mockData';

/**
 * Script de Seed pour initialiser la base de données MySQL via Prisma
 * Ce script lit les données 'PRODUITS' définies statiquement pour populer les tables.
 */
async function main() {
  console.log('🚧 Début du seed de la base de données...');

  // 1. Suppression de toutes les données existantes (évite les doublons lors des exécutions multiples)
  console.log('🗑️ Nettoyage des anciens produits...');
  await prisma.produit.deleteMany();

  // 2. Insertion des nouveaux produits
  console.log('🌱 Injection des produits...');
  for (const produit of PRODUITS) {
    await prisma.produit.create({
      data: {
        nom: produit.nom,
        description: produit.description ?? '',
        prix: produit.prix,
        image: produit.image ?? '',
        categorie: produit.categorie,
        disponible: true,
      },
    });
  }

  console.log('✅ Seed terminé avec succès ! Tous les produits ont été insérés.');
}

// Exécution du script complet
main()
  .catch((erreur: unknown) => {
    console.error('❌ Une erreur est survenue lors de l\'exécution du seed :', erreur);
    process.exit(1);
  })
  .finally(async () => {
    // Toujours terminer en fermant correctement l'instance de connexion Prisma
    await prisma.$disconnect();
  });