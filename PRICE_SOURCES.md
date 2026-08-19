# Registre des prix

Date de contrôle : 17 août 2026.

Les 300 références du catalogue actuel utilisent des marques et modèles de démonstration (`AgriFrance`, `TerraNova`, `FieldPro`, `AgroMax`, `Cultivance`, `Horizon Farm`). Aucun tarif fabricant ou concessionnaire correspondant exactement à ces références fictives ne peut être vérifié.

En conséquence :

- le prix actuel est `null` et affiché « Prix sur devis » ;
- le prix ancien est `null` ;
- la remise est `null` et aucun badge promotionnel n’est affiché ;
- la source et la date de vérification restent vides jusqu’à validation d’une référence commerciale réelle ;
- un export détaillé des 300 lignes est généré par `npm run export:prices` dans `reports/product-prices.csv`.

Une réduction ne peut être publiée que si `promotions.evidence_url` documente le prix de référence applicable. Référence réglementaire consultée : guide vendeur e-commerce de la DGCCRF, https://www.economie.gouv.fr/files/files/directions_services/dgccrf/media-document/guide-dgccrf-vendeur-e-commerce.pdf
