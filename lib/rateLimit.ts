// Stockage en mémoire des tentatives par IP
// Se réinitialise au redémarrage du serveur (acceptable pour un projet solo)

type Tentative = {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
};

const tentatives = new Map<string, Tentative>();

const MAX_TENTATIVES = 5;
const FENETRE_MS = 15 * 60 * 1000;
const BLOCAGE_MS = 15 * 60 * 1000;

export function verifierRateLimit(ip: string): {
  autorise: boolean;
  tempsRestant?: number;
  tentativesRestantes?: number;
} {
  const maintenant = Date.now();
  const entree = tentatives.get(ip);

  if (!entree) {
    return { autorise: true, tentativesRestantes: MAX_TENTATIVES };
  }

  if (entree.blockedUntil && maintenant < entree.blockedUntil) {
    const tempsRestant = Math.ceil((entree.blockedUntil - maintenant) / 1000);
    return { autorise: false, tempsRestant };
  }

  if (maintenant - entree.firstAttempt > FENETRE_MS) {
    tentatives.delete(ip);
    return { autorise: true, tentativesRestantes: MAX_TENTATIVES };
  }

  const tentativesRestantes = MAX_TENTATIVES - entree.count;
  return { autorise: tentativesRestantes > 0, tentativesRestantes };
}

export function enregistrerEchec(ip: string): void {
  const maintenant = Date.now();
  const entree = tentatives.get(ip);

  if (!entree) {
    tentatives.set(ip, { count: 1, firstAttempt: maintenant });
    return;
  }

  if (maintenant - entree.firstAttempt > FENETRE_MS) {
    tentatives.set(ip, { count: 1, firstAttempt: maintenant });
    return;
  }

  entree.count++;

  if (entree.count >= MAX_TENTATIVES) {
    entree.blockedUntil = maintenant + BLOCAGE_MS;
  }
}

export function reinitialiserTentatives(ip: string): void {
  tentatives.delete(ip);
}
