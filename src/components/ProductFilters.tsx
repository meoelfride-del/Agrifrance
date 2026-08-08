"use client";

import { useTranslation } from "react-i18next";
import { categorySeeds } from "@/src/data/products";

export type Filters = { search:string; category:string; brand:string; minPrice:string; maxPrice:string; power:string; year:string; condition:string; available:boolean; promotion:boolean; sort:string };

export function ProductFilters({ filters, brands, setFilters, open, setOpen }: { filters:Filters; brands:string[]; setFilters:(filters:Filters)=>void; open:boolean; setOpen:(open:boolean)=>void }) {
  const { t } = useTranslation();
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters({ ...filters, [key]: value });
  const reset = () => setFilters({ search:"",category:"",brand:"",minPrice:"",maxPrice:"",power:"",year:"",condition:"",available:false,promotion:false,sort:"popular" });
  return <aside className={`catalog-filters ${open ? "open" : ""}`}><div className="filters-heading"><h2>{t("catalog.filters")}</h2><button className="filters-close" onClick={() => setOpen(false)}>{t("common.close")}</button></div>
    <label>{t("common.search")}<input value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder={t("catalog.model")}/></label>
    <label>{t("catalog.category")}<select value={filters.category} onChange={(event) => update("category", event.target.value)}><option value="">{t("catalog.all")}</option>{categorySeeds.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
    <label>{t("catalog.brand")}<select value={filters.brand} onChange={(event) => update("brand", event.target.value)}><option value="">{t("catalog.all")}</option>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select></label>
    <div className="filter-pair"><label>{t("catalog.minPrice")}<input type="number" min="0" value={filters.minPrice} onChange={(event) => update("minPrice", event.target.value)}/></label><label>{t("catalog.maxPrice")}<input type="number" min="0" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)}/></label></div>
    <label>{t("catalog.power")}<input type="number" min="0" value={filters.power} onChange={(event) => update("power", event.target.value)}/></label>
    <label>{t("catalog.year")}<select value={filters.year} onChange={(event) => update("year", event.target.value)}><option value="">{t("catalog.all")}</option>{[2026,2025,2024,2023,2022].map((year) => <option key={year}>{year}</option>)}</select></label>
    <label>{t("catalog.condition")}<select value={filters.condition} onChange={(event) => update("condition", event.target.value)}><option value="">{t("catalog.all")}</option><option>Neuf</option><option>Occasion</option><option>Reconditionné</option></select></label>
    <label className="check-filter"><input type="checkbox" checked={filters.available} onChange={(event) => update("available", event.target.checked)}/>{t("catalog.availability")}</label>
    <label className="check-filter"><input type="checkbox" checked={filters.promotion} onChange={(event) => update("promotion", event.target.checked)}/>{t("catalog.promotion")}</label>
    <button className="button button-secondary" onClick={reset}>{t("common.reset")}</button>
  </aside>;
}
