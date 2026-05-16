export const BOISSONS = [
  { nom: 'Coca-Cola', prix: 2.00 },
  { nom: 'Coca-Cola Cerise', prix: 2.00 },
  { nom: 'Oasis', prix: 2.00 },
  { nom: 'Oasis Pomme Cassis', prix: 2.00 },
  { nom: 'Fanta Citron', prix: 2.00 }
];

export const SAUCES = [
  'Algérienne',
  'Curry',
  'Blanche',
  'Andalouse',
  'Bigi Burger',
  'Mayo',
  'Ketchup',
  'Barbecue'
];

export const OPTIONS_GRATINAGE = [
  'Mozza-Emmental',
  'Boursin',
  'Chèvre Miel',
  'Raclette'
] as const;

export const VIANDES_TACOS = [
  { nom: 'Escalope', prix: 0 },
  { nom: 'Steak', prix: 0 },
  { nom: 'Cordon Bleu', prix: 0 },
  { nom: 'Viande Hachée', prix: 0 },
  { nom: 'Tenders', prix: 1.50 }
];

import { produitsInitialData } from './placeholder-data';
const INGREDIENTS_DEMONTABLES: Record<string, string[]> = {
  'Cheese Burger':     ['Salade', 'Tomate', 'Oignon', 'Cornichon', 'Cheddar', 'Sauce'],
  'Chicken Burger':    ['Salade', 'Tomate', 'Cheddar', 'Sauce'],
  'Double Cheese':     ['Salade', 'Tomate', 'Oignon', 'Cornichon', 'Cheddar'],
  'Big Burger':        ['Salade', 'Tomate', 'Oignon', 'Cheddar'],
  'Double Bacon':      ['Salade', 'Tomate', 'Bacon', 'Cheddar'],
  'Chicken Beef':      ['Salade', 'Tomate', 'Cheddar', 'Sauce'],
  'Sandwich Kefta':    ['Salade', 'Tomate', 'Oignon'],
  'Sandwich Escalope': ['Salade', 'Tomate'],
  'Sandwich Kebab':    ['Salade', 'Tomate', 'Oignon'],
  'Sandwich Américain':['Salade', 'Frites'],
  'Tacos 1 Viande':    ['Salade', 'Tomate', 'Oignon', 'Sauce fromagère', 'Frites'],
  'Tacos 2 Viandes':   ['Salade', 'Tomate', 'Oignon', 'Sauce fromagère', 'Frites'],
  'Tacos 3 Viandes':   ['Salade', 'Tomate', 'Oignon', 'Sauce fromagère', 'Frites'],
  'Riz Crousty Classique': ['Oignon frit', 'Sauce chili thaï'],
  'Riz Crousty Spicy':     ['Oignon frit', 'Sauce chili thaï'],
  'Riz Crousty Baconaise': ['Oignon frit', 'Sauce chili thaï'],
  'Riz Crousty Truffe':    ['Oignon frit', 'Sauce chili thaï'],
};

export const PRODUITS = produitsInitialData.map((p, index) => ({
  id: index + 1,
  ...p,
  categorie: p.categorie as string,
  ingredientsDemontables: INGREDIENTS_DEMONTABLES[p.nom] ?? [],
}));
