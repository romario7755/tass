# Configuration du système d'authentification avec Better Auth et Resend

## Prérequis

1. **Compte Resend** : Créez un compte sur [resend.com](https://resend.com)
2. **API Key Resend** : Obtenez votre clé API dans le dashboard Resend
3. **Domaine vérifié** : Configurez un domaine dans Resend pour l'envoi d'emails

## Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Email Configuration with Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=onboarding@votredomaine.com
EMAIL_FROM_NAME="Car Rental"

# Better Auth Configuration
BETTER_AUTH_SECRET=yc63gU0S4RJidVnxS0+SnHyt8aUeDaugwSJ+actOFb0=
BETTER_AUTH_URL=http://localhost:3000
```

### 2. Configuration Resend

1. Allez sur [resend.com](https://resend.com) et créez un compte
2. Vérifiez votre domaine dans la section "Domains"
3. Générez une API Key dans "API Keys"
4. Mettez à jour `EMAIL_FROM` avec votre domaine vérifié

### 3. Base de données

Le schéma Prisma est configuré pour MongoDB avec les modèles :
- `User` : avec `emailVerified` comme `DateTime?`
- `Account` : pour les connexions sociales
- `Session` : pour les sessions utilisateur
- `Verification` : pour les tokens de vérification

### 4. Fonctionnalités disponibles

#### ✅ Inscription par email avec vérification
- L'utilisateur s'inscrit avec email/password
- Un email de vérification est envoyé automatiquement
- L'utilisateur doit cliquer sur le lien pour activer son compte

#### ✅ Connexion par email
- Connexion possible uniquement après vérification email
- Message d'erreur si email non vérifié avec option de renvoyer l'email

#### ✅ Réinitialisation de mot de passe
- Page `/forgot-password` pour demander la réinitialisation
- Email automatique avec lien sécurisé

#### ✅ Connexion Google OAuth
- Bouton "Continuer avec Google" sur la page de login

#### ✅ Templates d'emails responsive
- Design moderne avec HTML/CSS intégré
- Messages en français
- Compatible mobile et desktop

## Pages disponibles

- `/register` : Inscription
- `/login` : Connexion
- `/forgot-password` : Mot de passe oublié
- `/dashboard` : Page protégée après connexion

## API Endpoints

- `POST /api/auth/*` : Tous les endpoints Better Auth
- `POST /api/resend-verification` : Renvoyer email de vérification

## Tests

1. **Test d'inscription** :
   - Allez sur `/register`
   - Créez un compte avec un vrai email
   - Vérifiez votre boîte email
   - Cliquez sur le lien de vérification

2. **Test de connexion** :
   - Essayez de vous connecter avant vérification (doit échouer)
   - Vérifiez votre email puis connectez-vous

3. **Test de réinitialisation** :
   - Allez sur `/forgot-password`
   - Entrez votre email
   - Vérifiez l'email de réinitialisation

## Sécurité

- Tous les emails expirent automatiquement
- Les mots de passe sont hachés avec bcrypt
- Les sessions sont sécurisées
- CSRF protection activée

## Production

Pour la production, mettez à jour :

1. `BETTER_AUTH_URL` avec votre domaine de production
2. `EMAIL_FROM` avec votre domaine de production vérifié
3. `BETTER_AUTH_SECRET` avec une clé secrète forte
4. `trustedOrigins` dans `lib/auth.ts`