// Données statiques brutes basées sur ta liste pour commencer.
// Elles pourront servir par la suite à remplir la base de données via Prisma (seed) ou directement dans tes composants React.

export const produitsInitialData = [
  // =====================
  // 🍔 BURGERS
  // =====================
  {
    nom: "Cheese Burger",
    description: "Steak haché, cheddar, cornichons, ketchup, moutarde",
    prix: 3.5,
    image: "/images/Burger/Cheese.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true },
      { nom: "Option Gratiné Burger", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Chicken Burger",
    description: "Poulet pané croustillant, cheddar, salade, tomate",
    prix: 5.0,
    image: "/images/Burger/chicken.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true },
      { nom: "Option Gratiné Burger", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Double Cheese",
    description: "Double steak, double cheddar, cornichons, oignons",
    prix: 5.0,
    image: "/images/Burger/Double_cheese.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true },
      { nom: "Option Gratiné Burger", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Big Burger",
    description: "Burger à double étage, double steak, cheddar, salade",
    prix: 6.0,
    image: "/images/Burger/Big.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true },
      { nom: "Option Gratiné Burger", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Double Bacon",
    description: "Double steak, double cheddar, tranches de bacon, salade",
    prix: 6.0,
    image: "/images/Burger/Double_bacon.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true },
      { nom: "Option Gratiné Burger", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Chicken Beef",
    description: "Mix poulet pané et steak haché, cheddar, salade",
    prix: 6.5,
    image: "/images/Burger/chicken_beef.png",
    categorie: "Burgers",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true },
      { nom: "Option Gratiné Burger", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Menu RS1",
    description: "Cheese + Double Cheese + Frites + Boisson",
    prix: 11.0,
    image: "/images/Menu_formule/Menu_rs1.png",
    categorie: "Formules",
    ingredients: [
      { nom: "Gratinage (au four)", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Menu RS2",
    description: "Cheese + Chicken + Frites + Boisson",
    prix: 11.0,
    image: "/images/Menu_formule/Menu_rs2.png",
    categorie: "Formules",
    ingredients: [
      { nom: "Gratinage (au four)", prix: 2.0, estSuppl: true }
    ]
  },

    // =====================
    // 🌯 TACOS
    // =====================
    {
      nom: "Tacos 1 Viande",
    description: "1 Viande au choix, frites, sauce fromagère",
    prix: 8.0,
    image: "/images/Tacos/Tacos_1v.jpg",
    categorie: "Tacos",
    ingredients: [
      { nom: "Option Gratiné (Mozza, Boursin, Chèvre ou Raclette)", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true },
      { nom: "Frites Cheddar Bacon", prix: 2.0, estSuppl: true },
      { nom: "Supplément Tenders", prix: 1.5, estSuppl: true }
    ]
  },
  {
    nom: "Tacos 2 Viandes",
    description: "2 Viandes au choix, frites, sauce fromagère",
    prix: 9.0,
    image: "/images/Tacos/Tacos_2v.png",
    categorie: "Tacos",
    ingredients: [
      { nom: "Option Gratiné (Mozza, Boursin, Chèvre ou Raclette)", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true },
      { nom: "Frites Cheddar Bacon", prix: 2.0, estSuppl: true },
      { nom: "Supplément Tenders", prix: 1.5, estSuppl: true }
    ]
  },
  {
    nom: "Tacos 3 Viandes",
    description: "3 Viandes au choix, frites, sauce fromagère",
    prix: 10.0,
    image: "/images/Tacos/Tacos_3v.png",
    categorie: "Tacos",
    ingredients: [
      { nom: "Option Gratiné (Mozza, Boursin, Chèvre ou Raclette)", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true },
      { nom: "Frites Cheddar Bacon", prix: 2.0, estSuppl: true },
      { nom: "Supplément Tenders", prix: 1.5, estSuppl: true }
    ]
  },

  // =====================
  // 🥖 SANDWICHS
  // =====================
  {
    nom: "Sandwich Kefta",
    description: "Viande hachée épicée, salade, tomate, oignons",
    prix: 7.9,
    image: "/images/Sandwich/S_Kefta.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Sandwich Escalope",
    description: "Émincé de poulet mariné, salade, tomate",
    prix: 7.9,
    image: "/images/Sandwich/S_escalop.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Sandwich Kebab",
    description: "Viande kebab grillée, salade, tomate, oignons",
    prix: 7.9,
    image: "/images/Sandwich/S_Kebab.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Sandwich Américain",
    description: "Steak ou Merguez, frites à l'intérieur, salade",
    prix: 7.9,
    image: "/images/Sandwich/S_Americain.png",
    categorie: "Sandwichs",
    ingredients: [
      { nom: "Menu (Frites & Boisson)", prix: 2.0, estSuppl: true }
    ]
  },

  // =====================
  // 🍟 POUTINES
  // =====================
  {
    nom: "Poutine Chèvre Miel",
    description: "Taille L de base. Frites, sauce, chèvre fondu, miel.",
    prix: 9.0,
    image: "/images/Poutine/P_ChevreMiel.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Poutine Indienne",
    description: "Taille L de base. Frites, sauce fromagère curry/poulet.",
    prix: 9.0,
    image: "/images/Poutine/P_Indienne.png", // A remplacer
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Poutine Montagnard",
    description: "Taille L de base. Sauce fromagère onctueuse, oignons frits",
    prix: 9.0,
    image: "/images/Poutine/P_Montagnard.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Poutine Spicy",
    description: "Taille L de base. Frites, sauce épicée.",
    prix: 9.0,
    image: "/images/Poutine/P_Spicy.png", // A remplacer
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Poutine Boursin",
    description: "Taille L de base. Sauce fromagère au Boursin, oignons frits",
    prix: 9.0,
    image: "/images/Poutine/P_Boursin.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Poutine Savoyard",
    description: "Taille L de base. Lardons/Bacon, oignons frits, fromage fondu",
    prix: 9.0,
    image: "/images/Poutine/p_Savoyard.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Poutine Kebab",
    description: "Taille L de base. Frites, viande kebab, sauce fromagère",
    prix: 9.0,
    image: "/images/Poutine/P_Kebab.png",
    categorie: "Poutines",
    ingredients: [
      { nom: "Taille XL", prix: 2.0, estSuppl: true },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },

  // =====================
  // 🍚 RIZ CROUSTY
  // =====================
  {
    nom: "Riz Crousty Classique",
    description: "Riz croustillant, poulet, sauce base maison, oignon frit",
    prix: 10.50,
    image: "/images/Riz/R_crousty.png",
    categorie: "Riz Crousty",
    ingredients: [
      { nom: "Oignon frit", prix: 0, estSuppl: false },
      { nom: "Sauce chili thaï", prix: 0, estSuppl: false },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Riz Crousty Spicy",
    description: "Riz croustillant, poulet, sauce épicée maison, oignon frit",
    prix: 10.50,
    image: "/images/Riz/R_Spicy.png",
    categorie: "Riz Crousty",
    ingredients: [
      { nom: "Oignon frit", prix: 0, estSuppl: false },
      { nom: "Sauce chili thaï", prix: 0, estSuppl: false },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Riz Crousty Baconaise",
    description: "Riz croustillant, poulet, sauce bacon & mayo, oignon frit",
    prix: 10.50,
    image: "/images/Riz/R_Bayconaise.png",
    categorie: "Riz Crousty",
    ingredients: [
      { nom: "Oignon frit", prix: 0, estSuppl: false },
      { nom: "Sauce chili thaï", prix: 0, estSuppl: false },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },
  {
    nom: "Riz Crousty Truffe",
    description: "Riz croustillant, poulet, sauce à la truffe, oignon frit",
    prix: 10.50,
    image: "/images/Riz/riz_truffe.png",
    categorie: "Riz Crousty",
    ingredients: [
      { nom: "Oignon frit", prix: 0, estSuppl: false },
      { nom: "Sauce chili thaï", prix: 0, estSuppl: false },
      { nom: "Option Boisson", prix: 2.0, estSuppl: true }
    ]
  },

];
