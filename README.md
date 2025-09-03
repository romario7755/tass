# ENRE - Application d'Authentification Next.js

Une application web moderne construite avec Next.js 15, NextAuth.js, Prisma et PostgreSQL.

## 🚀 Fonctionnalités

- ✅ Authentification complète (inscription/connexion/déconnexion)
- ✅ Protection des routes avec middleware
- ✅ Interface utilisateur responsive avec Tailwind CSS
- ✅ Base de données PostgreSQL avec Prisma ORM
- ✅ Validation côté client et serveur
- ✅ Types TypeScript complets
- ✅ Gestion des erreurs robuste

## 🛠 Technologies

- **Framework**: Next.js 15 avec App Router
- **Authentification**: NextAuth.js
- **Base de données**: PostgreSQL avec Prisma
- **Styles**: Tailwind CSS
- **Types**: TypeScript
- **Chiffrement**: bcrypt

## 📋 Prérequis

- Node.js 18+
- PostgreSQL
- npm ou yarn

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd enre
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Modifier `.env.local` avec vos valeurs :
```env
DATABASE_URL="postgresql://username:password@localhost:5432/enre_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-très-sécurisée"
```

4. **Configuration de la base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# Ou utiliser les migrations (recommandé pour la production)
npm run db:migrate
```

## 🚀 Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir Prisma Studio (interface de gestion de la DB)
npm run db:studio

# Linter le code
npm run lint
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
enre/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # Configuration NextAuth
│   │   └── register/               # API d'inscription
│   ├── dashboard/                  # Page tableau de bord
│   ├── login/                      # Page de connexion
│   ├── register/                   # Page d'inscription
│   ├── layout.tsx                  # Layout racine
│   ├── page.tsx                    # Page d'accueil
│   └── providers.tsx               # Providers React
├── prisma/
│   └── schema.prisma              # Schéma de base de données
├── types/
│   └── next-auth.d.ts             # Types NextAuth
└── middleware.ts                   # Protection des routes
```

## 🔐 Authentification

L'application utilise NextAuth.js avec un provider credentials personnalisé :

- **Inscription** : `/register` - Création d'un nouveau compte
- **Connexion** : `/login` - Authentification utilisateur
- **Dashboard** : `/dashboard` - Zone protégée
- **Déconnexion** : Bouton disponible dans le dashboard

## 🗃 Base de données

Le schéma Prisma définit un modèle `User` simple :

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## 🛡 Sécurité

- Mots de passe hachés avec bcrypt (12 rounds)
- Validation des entrées côté client et serveur
- Protection CSRF avec NextAuth
- Routes protégées par middleware
- Variables d'environnement pour les secrets

## 🚀 Production

```bash
# Build de production
npm run build

# Démarrage en production
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.