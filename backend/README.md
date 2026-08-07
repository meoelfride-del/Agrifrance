# Backend AgriFrance

API REST TypeScript sécurisée pour le catalogue, les comptes B2B et les devis.

## Démarrage

1. Créez une base PostgreSQL nommée `agriforce`.
2. Copiez `.env.example` vers `.env` et remplacez les secrets JWT.
3. Lancez `npm install`, puis `npm run db:migrate` et `npm run db:seed`.
4. Démarrez avec `npm run dev`. L’API écoute par défaut sur `http://localhost:4000`.

Les prix sont enregistrés en centimes d’euro pour éviter les erreurs d’arrondi. Les requêtes SQL utilisent exclusivement des paramètres. Les comptes sensibles exigent un code MFA et les jetons sont placés dans des cookies HttpOnly/Secure/SameSite Strict.
