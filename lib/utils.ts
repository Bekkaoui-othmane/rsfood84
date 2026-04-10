/**
 * Fonction de mappage sécurisée pour les catégories
 * Permet de normaliser les types de catégories récupérés depuis 
 * la BDD (Prisma) vers les types littéraux stricts exigés par le store/Tunnel.
 */
export const mapperCategorie = (cat: string): 
  'burger' | 'tacos' | 'poutine' | 'formule' | 'riz-crousty' => {
  const mapping: Record<string, 
    'burger' | 'tacos' | 'poutine' | 'formule' | 'riz-crousty'> = {
    'burgers': 'burger',
    'burger': 'burger',
    'tacos': 'tacos',
    'poutines': 'poutine',
    'poutine': 'poutine',
    'formules': 'formule',
    'formule': 'formule',
    'sandwichs': 'burger',
    'riz crousty': 'riz-crousty',
  };
  return mapping[cat.toLowerCase()] ?? 'burger';
};