import { prisma } from '../lib/prisma';

async function main() {
  const produits = await prisma.produit.findMany({
    include: { ingredients: true },
    take: 2
  });
  console.log(JSON.stringify(produits, null, 2));
}

main().finally(() => prisma.$disconnect());