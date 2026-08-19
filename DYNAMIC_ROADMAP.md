# Plan de mise en production dynamique

## Phase 1 — Corrections indispensables

Objectif : ne publier aucune information trompeuse. Tâches : valider les références, remplacer les images sans provenance, configurer les environnements et exécuter les migrations. Parties : `src/data`, `backend/sql`, fichiers de sources. Dépendance : validation métier. Priorité : critique. Résultat : catalogue juridiquement et commercialement fiable. Vérification : revue croisée produit/source/date.

## Phase 2 — Catalogue dynamique

Objectif : supprimer la source statique. Tâches : importer les produits dans PostgreSQL, connecter le frontend à `/api/products`, créer l’administration CRUD et le stockage d’images. Parties : API catalogue, tables `products`, `product_images`, `inventory`, `price_history`. Dépendance : base et stockage objet. Priorité : haute. Résultat : prix, stocks et photos modifiables sans code. Vérification : création, modification, archivage et restauration depuis un compte administrateur.

## Phase 3 — Fonctionnalités commerciales

Objectif : couvrir devis et commande. Tâches : synchroniser panier/favoris, créer commandes, choisir le paiement, gérer livraison et notifications. Parties : `carts`, `orders`, `payments`, `deliveries`, API. Dépendance : prestataires paiement/e-mail/WhatsApp. Priorité : haute. Résultat : parcours traçable jusqu’à la livraison. Vérification : tests E2E et rapprochement des montants côté serveur.

## Phase 4 — Conformité et confiance

Objectif : conformité France/UE et pays de vente. Tâches : faire valider CGV, retours, confidentialité, cookies, mentions et règles promotionnelles ; conserver les preuves de licences. Parties : pages légales, `promotions`, registres de sources. Dépendance : conseil juridique. Priorité : haute. Résultat : documents cohérents avec l’activité réelle. Vérification : audit juridique daté.

## Phase 5 — Tests et qualité

Objectif : prévenir les régressions. Tâches : tests API avec base isolée, navigateur multi-écrans, accessibilité, charge, dépendances et sauvegardes. Parties : `tests/`, backend et CI. Dépendance : environnement de test. Priorité : moyenne. Résultat : pipeline bloquant les régressions. Vérification : rapport CI et audit Lighthouse.

## Phase 6 — Mise en production

Objectif : exploitation fiable. Tâches : domaine/SSL, PostgreSQL managé, stockage, secrets Vercel, sauvegardes, alertes, journaux et analytics consentis. Dépendance : comptes fournisseurs. Priorité : critique avant ouverture commerciale. Résultat : service observable et restaurable. Vérification : test de restauration, test d’alerte et parcours réel contrôlé.
