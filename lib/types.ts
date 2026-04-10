import { OPTIONS_GRATINAGE } from '@/lib/mockData';

export type ChoixGratinage = typeof OPTIONS_GRATINAGE[number];

export type ConfigCommande = {
  // Optionnel : s'il est nécessaire de stocker la catégorie dans la config
  categorie?: 'burger' | 'tacos' | 'poutine' | 'formule' | 'riz-crousty';
  avecFritesBoisson: boolean;
  gratinage: ChoixGratinage | null;
  fritesFromage: boolean;
  sauce: string | null;
  boisson1: string | null;
  boisson2: string | null;
  ingredientsRetires: string[];
  nbViandes: number | null;
  viandes: string[];
  taillePoutine: 'L' | 'XL' | null;
  burgersFormule: { nomBurger: string, ingredientsRetires: string[], gratinage: string | null }[];
};
