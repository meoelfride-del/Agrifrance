import { query, pool } from "./db.js";

const products = [
  ["Terra X9 410", "terra-x9-410", "AgriFrance", 42500000, 410, "CVT", "new"],
  ["Terra M7 250", "terra-m7-250", "AgriFrance", 23500000, 250, "Powershift", "new"],
  ["Terra C5 145", "terra-c5-145", "AgriFrance", 11200000, 145, "Semi-Powershift", "used"],
  ["CargoPro 24T", "cargopro-24t", "AgriFrance", 3850000, 0, "Tandem", "new"],
  ["CargoMax 18T", "cargomax-18t", "AgriFrance", 2790000, 0, "Double essieu", "new"],
  ["Harvest H8", "harvest-h8", "AgriFrance", 39500000, 340, "Hydrostatique", "new"],
  ["SeedMaster 600", "seedmaster-600", "AgriFrance", 4650000, 0, "ISOBUS", "new"],
  ["FieldSpray 4000", "fieldspray-4000", "AgriFrance", 6290000, 0, "GPS section control", "new"],
  ["Terra X7 330", "terra-x7-330", "AgriFrance", 34500000, 330, "CVT", "new"],
  ["Terra M6 210", "terra-m6-210", "AgriFrance", 18800000, 210, "Powershift", "new"],
  ["Terra V4 105", "terra-v4-105", "AgriFrance", 7900000, 105, "Mécanique 24x24", "new"],
  ["CargoPro 30T", "cargopro-30t", "AgriFrance", 4890000, 0, "Tridem", "new"],
  ["CargoField 14T", "cargofield-14t", "AgriFrance", 2180000, 0, "Double essieu", "new"],
  ["CargoMini 8T", "cargomini-8t", "AgriFrance", 1290000, 0, "Simple essieu", "new"],
  ["Harvest H10", "harvest-h10", "AgriFrance", 53500000, 455, "Hydrostatique", "new"],
  ["Harvest H6", "harvest-h6", "AgriFrance", 31500000, 285, "Hydrostatique", "new"],
  ["ForageCut 900", "foragecut-900", "AgriFrance", 56500000, 585, "4 roues motrices", "new"],
  ["SeedMaster 900", "seedmaster-900", "AgriFrance", 6890000, 0, "ISOBUS", "new"],
  ["SeedDirect 400", "seeddirect-400", "AgriFrance", 3950000, 0, "Dosage électrique", "new"],
  ["PlanterPro 12", "planterpro-12", "AgriFrance", 5290000, 0, "Électrique", "new"],
  ["FieldSpray 5200", "fieldspray-5200", "AgriFrance", 8490000, 0, "GPS RTK", "new"],
  ["FieldSpray 3000", "fieldspray-3000", "AgriFrance", 4790000, 0, "Coupure de sections", "new"],
  ["CropGuard 1800", "cropguard-1800", "AgriFrance", 2360000, 0, "Régulation DPAE", "new"]
];
for (const p of products) {
  await query(`INSERT INTO products (name,slug,brand,price_cents,engine_power_hp,transmission_type,condition)
    VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (slug) DO NOTHING`, p);
}
const parts = [
  ["AF-MOT-1048","Filtre à huile moteur","Terra X7 / X9",7400,"available",42,"Moteur"],
  ["AF-HYD-2051","Filtre hydraulique haute pression","Terra M6 / M7 / X9",11600,"available",18,"Hydraulique"],
  ["AF-REC-3302","Kit de courroies moissonneuse","Harvest H6 / H8",48900,"low_stock",4,"Récolte"],
  ["AF-REC-1120","Couteau de barre de coupe","Harvest H8 / H10",3800,"available",120,"Récolte"],
  ["AF-REM-4700","Vérin de benne renforcé","CargoPro 24T / 30T",128000,"on_order",0,"Remorque"],
  ["AF-REM-2218","Moyeu complet tandem","CargoMax / CargoPro",73500,"available",9,"Remorque"],
  ["AF-SEM-0850","Disque ouvreur semoir","SeedMaster / SeedDirect",9200,"available",64,"Semis"],
  ["AF-PUL-0412","Buse céramique anti-dérive","FieldSpray / CropGuard",2400,"available",250,"Protection"],
  ["AF-ELC-6077","Capteur de pression ISOBUS","Toutes gammes Smart",26500,"low_stock",6,"Électronique"]
];
for (const p of parts) {
  await query(`INSERT INTO spare_parts (reference,name,compatibility,price_cents,stock_status,stock_quantity,category)
    VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (reference) DO NOTHING`, p);
}
console.log("Catalogue de démonstration ajouté.");
await pool.end();
