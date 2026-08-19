import { mkdir, writeFile } from "node:fs/promises";

const categories = [
  ["tracteurs", "Terra"], ["moissonneuses-batteuses", "Harvest"], ["ensileuses", "Forage"],
  ["pulverisateurs", "FieldSpray"], ["semoirs", "SeedMaster"], ["presses-balles", "BalePro"],
  ["chargeurs", "LoadMax"], ["travail-sol", "SoilPro"], ["equipements-recolte", "CropFlow"],
  ["pieces-accessoires", "AgriParts"],
];
const brands = ["AgriFrance", "TerraNova", "FieldPro", "AgroMax", "Cultivance", "Horizon Farm"];
const series = ["100", "220", "360", "480", "600"];
const rows = [["id","produit","ancien_prix","prix_actuel","remise","etat","source","date_verification","statut"]];
for (const [category, prefix] of categories) for (let index=0; index<30; index++) {
  const brand=brands[index%brands.length];
  const model=`${prefix} ${series[index%series.length]}${String.fromCharCode(65+Math.floor(index/5))}`;
  const state=index%9===0?"Occasion":index%13===0?"Reconditionné":"Neuf";
  rows.push([`${category}-${String(index+1).padStart(2,"0")}`,`${brand} ${model}`,"","","",state,"","","Prix sur devis — référence de démonstration"]);
}
const csv=rows.map((row)=>row.map((value)=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\n");
await mkdir("reports",{recursive:true});
await writeFile("reports/product-prices.csv",csv,"utf8");
console.log(`Registre généré : ${rows.length-1} produits`);
