# Rapport de tests — 17 août 2026

| Contrôle | Résultat |
|---|---|
| ESLint frontend/backend | Réussi, aucune erreur ni avertissement |
| Build Next.js 16.3.1 | Réussi, 94 pages générées |
| Vérification TypeScript frontend | Réussie pendant `next build` |
| Build TypeScript backend | Réussi |
| Test rendu HTML | 1/1 réussi |
| Tests backend existants | 0 test découvert — couverture à créer |
| Parcours E2E navigateur | Réussi |
| Responsive | 320, 375, 425, 768, 1024 et 1440 px réussis, aucun débordement horizontal |
| Catalogue | 300 résultats, recherche et panneau de filtres vérifiés |
| Fiche produit | Route, textes alternatifs et ajout au panier vérifiés |
| Panier | Ajout et persistance après rechargement vérifiés |
| Langues | Changement et persistance après rechargement vérifiés |
| Devis | Validation de confidentialité et réponse API contrôlées |
| Routes | `/`, `/catalog`, `/parts`, `/quote-request`, `/legal/privacy`, `/robots.txt`, `/sitemap.xml` : HTTP 200 |
| Console navigateur | Aucune erreur lors du passage final |
| Audit npm frontend | 0 vulnérabilité après mise à niveau Next.js 16.3.1 |
| Audit npm backend | 0 vulnérabilité |

Le test E2E simule uniquement la réponse réseau du devis. La persistance PostgreSQL doit être testée dans une base isolée après configuration de `DATABASE_URL`.
