import type { ArticlePanier } from '@/store/panierStore';

const NUMERO_WHATSAPP = '33699569511';

type ArticleCalcule = {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  options: string[];
};

type CheckoutResponse = {
  articles: ArticleCalcule[];
  total: number;
};

export async function genererLienWhatsApp(articles: ArticlePanier[]): Promise<string> {
  // ConfigCommande a un champ 'categorie' optionnel absent du configSchema (.strict())
  // On le retire avant l'envoi pour éviter le rejet par Zod côté serveur
  const payload = {
    articles: articles.map(article => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categorie, ...configSansCategorie } = article.config;
      return {
        produitId: article.produitId,
        quantite: article.quantite,
        config: configSansCategorie,
      };
    }),
  };

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Erreur lors du calcul de la commande');
  }

  const data: CheckoutResponse = await response.json();

  // Construction du message WhatsApp
  let message = '🍔 Bonjour Rs Food84 !\n\n';
  message += 'Voici ma commande :\n\n';

  for (const article of data.articles) {
    message += `▸ ${article.quantite}x ${article.nom}\n`;

    for (const option of article.options) {
      message += `   - ${option}\n`;
    }

    const totalArticle = (article.prixUnitaire * article.quantite).toFixed(2);
    message += `   = ${totalArticle}€\n\n`;
  }

  message += `💰 Total : ${data.total.toFixed(2)}€\n\n`;
  message += 'Merci ! 🙏';

  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
