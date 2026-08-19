# Audit technique et commercial — AgriFrance

Date : 17 août 2026

## Diagnostic

- Frontend : Next.js 16.2.6, React 19.2.6, TypeScript 5.9.3, Vite 8/Vinext.
- Backend : Express 5, PostgreSQL, Zod, Argon2id, JOSE, MFA TOTP, cookies `HttpOnly` et limitation de débit.
- Deux surfaces historiques coexistent : la boutique modulaire dans `src/` et quelques pages anciennes dans `app/platform.tsx`.
- Le catalogue local contient 300 références de démonstration. Les anciens prix, promotions et stocks générés n’étaient pas prouvés.
- Le formulaire de devis simulait auparavant un succès sans persistance.
- Les images locales n’avaient pas de provenance enregistrée.

## Corrections réalisées

- Suppression de l’affichage des prix et promotions non vérifiables ; repli honnête sur « Prix sur devis ».
- Ajout des champs de traçabilité des prix et des images.
- Calcul de remise centralisé, uniquement lorsque deux prix valides existent.
- Envoi réel du devis vers l’API, avec erreur visible si le service est indisponible.
- Devis invité autorisé et protégé par la limitation de débit existante.
- Favoris et comparaison persistants localement.
- Migration PostgreSQL couvrant catalogue, images, stocks, prix, promotions, paniers, commandes, paiements, favoris, avis et livraisons.
- API catalogue paginée, filtrable, triable et administrable par rôles.
- Révocation de session lors de la déconnexion.
- En-têtes de sécurité du frontend et suppression de la dépendance de build à Google Fonts.
- Correction de l’encodage corrompu dans l’ancienne interface et les tests E2E.

## Limites connues

- Les trois images héritées doivent être remplacées après vérification individuelle de leurs droits.
- Les références fictives doivent être remplacées ou validées par le gestionnaire avant publication commerciale.
- L’administration dispose de fondations API mais pas encore d’une interface complète.
- Le paiement nécessite le choix d’un prestataire et des clés de production ; aucune fausse intégration n’a été ajoutée.
- Les avis existants ne doivent pas être publiés comme authentiques sans preuve.
