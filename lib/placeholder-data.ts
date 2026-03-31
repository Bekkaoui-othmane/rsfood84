// Données statiques brutes basées sur ta liste pour commencer.
// Elles pourront servir par la suite à remplir la base de données via Prisma (seed) ou directement dans tes composants React.

export const produitsInitialData = [
  // =====================
  // 🍔 BURGERS
  // =====================
  {
    nom: "Big Burger",
    description: "Burger à double étage, double steak, cheddar, salade",
    prix: 10.0,
    image: "/images/Burger/Big.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Steak", prix: 0, estSuppl: false },
      { nom: "Cheddar", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Cheese Burger",
    description: "Steak haché, cheddar, cornichons, ketchup, moutarde",
    prix: 8.5,
    image: "/images/Burger/Cheese.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Steak", prix: 0, estSuppl: false },
      { nom: "Cheddar", prix: 0, estSuppl: false },
      { nom: "Cornichons", prix: 0, estSuppl: false },
      { nom: "Ketchup", prix: 0, estSuppl: false },
      { nom: "Moutarde", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Chicken Burger",
    description: "Poulet pané croustillant, cheddar, salade, tomate",
    prix: 9.0,
    image: "/images/Burger/chicken.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Poulet pané", prix: 0, estSuppl: false },
      { nom: "Cheddar", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false },
      { nom: "Tomate", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Chicken Beef",
    description: "Mix poulet pané et steak haché, cheddar, salade",
    prix: 11.0,
    image: "/images/Burger/chicken_beef.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Poulet pané", prix: 0, estSuppl: false },
      { nom: "Steak haché", prix: 0, estSuppl: false },
      { nom: "Cheddar", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Double Bacon",
    description: "Double steak, double cheddar, tranches de bacon, salade",
    prix: 11.5,
    image: "/images/Burger/Double_bacon.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Double Steak", prix: 0, estSuppl: false },
      { nom: "Double Cheddar", prix: 0, estSuppl: false },
      { nom: "Bacon", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Double Cheese",
    description: "Double steak, double cheddar, cornichons, oignons",
    prix: 10.5,
    image: "/images/Burger/Double_cheese.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Double Steak", prix: 0, estSuppl: false },
      { nom: "Double Cheddar", prix: 0, estSuppl: false },
      { nom: "Cornichons", prix: 0, estSuppl: false },
      { nom: "Oignons", prix: 0, estSuppl: false }
    ]
  },

  // =====================
  // 🌯 TACOS
  // =====================
  {
    nom: "Tacos 1 Viande",
    description: "Viandes au choix, frites, sauce fromagère",
    prix: 8.0,
    image: "/images/Menu_formule/Fiche_tacos.png",
    categorie: "Tacos",
    ingredients: [
      { nom: "Tenders", prix: 1.5, estSuppl: true },
      { nom: "Escalope", prix: 0, estSuppl: false },
      { nom: "Steak", prix: 0, estSuppl: false },
      { nom: "Cordon Bleu", prix: 0, estSuppl: false },
      { nom: "Viande Hachée", prix: 0, estSuppl: false },
      { nom: "Option Gratiné", prix: 2.0, estSuppl: true },
      { nom: "Frites Cheddar Bacon", prix: 2.0, estSuppl: true },
      { nom: "Supplément Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Tacos 2 Viandes",
    description: "Viandes au choix, frites, sauce fromagère",
    prix: 9.0,
    image: "/images/Menu_formule/Fiche_tacos.png",
    categorie: "Tacos",
    ingredients: [
      { nom: "Tenders", prix: 1.5, estSuppl: true },
      { nom: "Escalope", prix: 0, estSuppl: false },
      { nom: "Steak", prix: 0, estSuppl: false },
      { nom: "Cordon Bleu", prix: 0, estSuppl: false },
      { nom: "Viande Hachée", prix: 0, estSuppl: false },
      { nom: "Option Gratiné", prix: 2.0, estSuppl: true },
      { nom: "Frites Cheddar Bacon", prix: 2.0, estSuppl: true },
      { nom: "Supplément Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Tacos 3 Viandes",
    description: "Viandes au choix, frites, sauce fromagère",
    prix: 10.0,
    image: "/images/Menu_formule/Fiche_tacos.png",
    categorie: "Tacos",
    ingredients: [
      { nom: "Tenders", prix: 1.5, estSuppl: true },
      { nom: "Escalope", prix: 0, estSuppl: false },
      { nom: "Steak", prix: 0, estSuppl: false },
      { nom: "Cordon Bleu", prix: 0, estSuppl: false },
      { nom: "Viande Hachée", prix: 0, estSuppl: false },
      { nom: "Option Gratiné", prix: 2.0, estSuppl: true },
      { nom: "Frites Cheddar Bacon", prix: 2.0, estSuppl: true },
      { nom: "Supplément Boisson", prix: 2.0, estSuppl: true }
    ]
  },

  // =====================
  // 🥖 SANDWICHS
  // =====================
  {
    nom: "Américain",
    description: "Steak haché, frites à l'intérieur, salade, tomate",
    prix: 9.0, // estimé
    image: "/images/Sandwich/S_Americain.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Steak haché", prix: 0, estSuppl: false },
      { nom: "Frites", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false },
      { nom: "Tomate", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Escalope",
    description: "Émincé de poulet mariné, salade, tomate",
    prix: 9.0, // estimé
    image: "/images/Sandwich/S_escalop.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Poulet mariné", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false },
      { nom: "Tomate", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Kebab",
    description: "Viande kebab grillée, oignons, salade, tomate",
    prix: 8.5, // estimé
    image: "/images/Sandwich/S_Kebab.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Viande Kebab", prix: 0, estSuppl: false },
      { nom: "Oignons", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false },
      { nom: "Tomate", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Kefta",
    description: "Viande hachée épicée, oignons, salade, tomate",
    prix: 9.5, // estimé
    image: "/images/Sandwich/S_Kefta.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Viande Kefta", prix: 0, estSuppl: false },
      { nom: "Oignons", prix: 0, estSuppl: false },
      { nom: "Salade", prix: 0, estSuppl: false },
      { nom: "Tomate", prix: 0, estSuppl: false }
    ]
  },

  // =====================
  // 🍟 POUTINES & BOWLS
  // =====================
  {
    nom: "Boursin",
    description: "Sauce fromagère au Boursin, oignons frits",
    prix: 9.5, // estimé
    image: "/images/Poutine/P_Boursin.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Sauce fromagère Boursin", prix: 0, estSuppl: false },
      { nom: "Oignons frits", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Chèvre Miel",
    description: "Fromage de chèvre fondu, miel",
    prix: 9.5, // estimé
    image: "/images/Poutine/P_ChevreMiel.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Chèvre fondu", prix: 0, estSuppl: false },
      { nom: "Miel", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Kebab",
    description: "Frites, viande kebab, sauce fromagère",
    prix: 9.5, // estimé
    image: "/images/Poutine/P_Kebab.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Frites", prix: 0, estSuppl: false },
      { nom: "Viande Kebab", prix: 0, estSuppl: false },
      { nom: "Sauce fromagère", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Montagnard",
    description: "Sauce fromagère onctueuse, oignons frits",
    prix: 9.5, // estimé
    image: "/images/Poutine/P_Montagnard.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Sauce fromagère onctueuse", prix: 0, estSuppl: false },
      { nom: "Oignons frits", prix: 0, estSuppl: false }
    ]
  },
  {
    nom: "Savoyard",
    description: "Lardons/Bacon, oignons frits, fromage fondu",
    prix: 10.0, // estimé
    image: "/images/Poutine/p_Savoyard.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Lardons/Bacon", prix: 0, estSuppl: false },
      { nom: "Oignons frits", prix: 0, estSuppl: false },
      { nom: "Fromage fondu", prix: 0, estSuppl: false }
    ]
  }
];
