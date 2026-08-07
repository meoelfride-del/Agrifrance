# AgriFrance Machines

Plateforme e-commerce responsive pour tracteurs et machinerie agricole.

## Tarification et visuels

Les prix sont affichés en euros HT et constituent des estimations indicatives de marché, ajustées par puissance et catégorie à partir des gammes professionnelles observables en France. John Deere France ne publie pas de tarif neuf exhaustif pour ses grandes machines et invite généralement à demander une offre au concessionnaire : le devis commercial reste donc la référence finale.

Les photographies intégrées au projet sont des créations originales de démonstration. Aucune photographie, marque ou identité visuelle John Deere n’est copiée dans le dépôt ; l’utilisation d’images constructeur nécessite une autorisation ou une licence adaptée.

## Prérequis

- Node.js 22 ou supérieur
- PostgreSQL 15 ou supérieur
- VS Code

## Ouvrir et démarrer le projet

1. Décompressez l’archive.
2. Ouvrez le dossier `agriforce-machines` dans VS Code.
3. Dans un premier terminal : `npm install`, puis `npm run dev`.
4. Dans un second terminal : `cd backend`, `npm install`, copiez `.env.example` vers `.env`, renseignez les secrets, puis lancez `npm run db:migrate`, `npm run db:seed` et `npm run dev`.
5. Ouvrez l’adresse affichée par le front-end dans votre navigateur.

## Architecture

- `app/` : interface Next.js/React et routes du site.
- `public/` : médias optimisés.
- `backend/` : API Node.js/TypeScript, PostgreSQL, authentification et RBAC.
- `backend/sql/` : migration de la base de données.

## Sécurité

Le backend inclut Argon2id, JWT à durée courte, rotation des sessions, cookies HttpOnly/Secure/SameSite Strict, protection CSRF, Helmet, CORS restrictif, limitation de débit, validation Zod, rôles B2B et journalisation de connexion. En production, configurez TLS 1.3, un gestionnaire de secrets, une base chiffrée et un stockage objet privé pour les documents.
