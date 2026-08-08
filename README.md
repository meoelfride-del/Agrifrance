# AgriFrance Machines

Plateforme e-commerce responsive pour tracteurs et machinerie agricole.

## Fonctionnalités

- catalogue de 300 références, 30 dans chacune des 10 catégories ;
- recherche, neuf filtres, quatre tris et chargement progressif ;
- pages produit avec galerie, zoom, panier, devis, téléphone et WhatsApp ;
- panier persistant avec quantités, livraison estimée et commande WhatsApp ;
- français, anglais, espagnol, allemand et portugais avec persistance du choix ;
- SEO Next.js : métadonnées, Open Graph, Schema.org, sitemap et robots ;
- responsive vérifié de 320 à 1440 px.

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

Sous Windows PowerShell :

```powershell
npm install
npm run dev
```

Contrôles disponibles :

```powershell
npm run lint
npm run build
npm run test:e2e
```

Le test E2E utilise Chrome installé dans `C:\Program Files\Google\Chrome\Application\chrome.exe` et suppose que le serveur de développement écoute sur `http://localhost:3000`.

## Ajouter un produit

Les données sont construites dans `src/data/products.ts`. Ajoutez une famille dans `categorySeeds` ou ajustez les séries de modèles. Chaque produit expose l’identifiant, le slug, la marque, le modèle, la catégorie, les prix, la puissance, l’année, la transmission, les heures, l’état, le stock, les descriptions, les caractéristiques et quatre images avec textes alternatifs.

Les visuels actuels sont des créations de démonstration locales. Pour une image définitive, ajoutez un WebP ou AVIF optimisé dans `public/`, puis remplacez le chemin et conservez un texte alternatif précis.

## Ajouter une traduction

Les ressources se trouvent dans `src/locales/{fr,en,es,de,pt}/translation.json`. Ajoutez une même clé dans les cinq fichiers, puis utilisez `t("groupe.cle")` dans un composant client. Pour ajouter une langue, créez son fichier, importez-le dans `src/services/i18n.ts` et ajoutez son code à `supportedLanguages`.

## Architecture

- `app/` : interface Next.js/React et routes du site.
- `public/` : médias optimisés.
- `backend/` : API Node.js/TypeScript, PostgreSQL, authentification et RBAC.
- `backend/sql/` : migration de la base de données.

## Sécurité

Le backend inclut Argon2id, JWT à durée courte, rotation des sessions, cookies HttpOnly/Secure/SameSite Strict, protection CSRF, Helmet, CORS restrictif, limitation de débit, validation Zod, rôles B2B et journalisation de connexion. En production, configurez TLS 1.3, un gestionnaire de secrets, une base chiffrée et un stockage objet privé pour les documents.
