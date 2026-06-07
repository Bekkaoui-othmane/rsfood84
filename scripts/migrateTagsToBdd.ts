import { prisma } from '../lib/prisma';

async function main() {
  console.log('🚧 Début migration tags vers BDD...');

  await prisma.produitTag.deleteMany({});
  console.log('🗑️  ProduitTag existants supprimés (reset propre)');

  const produits = await prisma.produit.findMany({
    include: { ingredients: true },
  });

  let liaisonsCreated = 0;

  for (const produit of produits) {
    // Tags depuis la description
    if (produit.description) {
      const tags = produit.description.split(',').map(t => t.trim()).filter(Boolean);

      for (let i = 0; i < tags.length; i++) {
        const tag = await prisma.tag.upsert({
          where: { nom: tags[i] },
          update: {},
          create: { nom: tags[i] },
        });

        await prisma.produitTag.create({
          data: {
            produitId: produit.id,
            tagId: tag.id,
            type: 'description',
            ordre: i,
          },
        });
        liaisonsCreated++;
      }
    }

    // Tags depuis les ingrédients démontables (estSuppl=false)
    const ingDemontables = produit.ingredients.filter(i => !i.estSuppl);

    for (let i = 0; i < ingDemontables.length; i++) {
      const ing = ingDemontables[i];

      const tag = await prisma.tag.upsert({
        where: { nom: ing.nom },
        update: {},
        create: { nom: ing.nom },
      });

      const existant = await prisma.produitTag.findFirst({
        where: { produitId: produit.id, tagId: tag.id, type: 'ingredient_demontable' },
      });

      if (!existant) {
        await prisma.produitTag.create({
          data: {
            produitId: produit.id,
            tagId: tag.id,
            type: 'ingredient_demontable',
            ordre: i,
          },
        });
        liaisonsCreated++;
      }
    }
  }

  const totalTags = await prisma.tag.count();
  console.log('✅ Migration terminée :');
  console.log(`   - ${totalTags} tags uniques en BDD`);
  console.log(`   - ${liaisonsCreated} liaisons ProduitTag créées`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
