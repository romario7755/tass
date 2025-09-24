import Stripe from 'stripe';

// Vérification que la clé existe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY manquant dans les variables d\'environnement');
}

// Création de l'instance Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion:"2025-08-27.basil",
});

export default stripe;
export { stripe };