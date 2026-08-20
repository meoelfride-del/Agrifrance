"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/src/components/AppShell";
import { ProductFilters, type Filters } from "@/src/components/ProductFilters";
import { ProductGrid } from "@/src/components/ProductGrid";
import { useProductCatalog } from "@/src/context/ProductCatalogContext";

const defaults: Filters = { search:"",category:"",brand:"",minPrice:"",maxPrice:"",power:"",year:"",condition:"",available:false,promotion:false,sort:"popular" };

export function CatalogPage({ initialCategory = "" }: { initialCategory?: string }) {
  const products = useProductCatalog();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ ...defaults, category: initialCategory });
  const [limit, setLimit] = useState(18);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const deferredSearch = useDeferredValue(filters.search.toLowerCase());
  const brands = useMemo(() => [...new Set(products.map((product) => product.marque))].sort(), [products]);
  const filtered = useMemo(() => products.filter((product) =>
    (!deferredSearch || `${product.nom} ${product.modele} ${product.marque}`.toLowerCase().includes(deferredSearch)) &&
    (!filters.category || product.categorySlug === filters.category) && (!filters.brand || product.marque === filters.brand) &&
    (!filters.minPrice || (product.prix !== null && product.prix >= Number(filters.minPrice))) && (!filters.maxPrice || (product.prix !== null && product.prix <= Number(filters.maxPrice))) &&
    (!filters.power || product.powerValue >= Number(filters.power)) && (!filters.year || product.annee === Number(filters.year)) &&
    (!filters.condition || product.etat === filters.condition) && (!filters.available || product.disponible) && (!filters.promotion || product.promotion)
  ).toSorted((a,b) => filters.sort === "priceAsc" ? (a.prix ?? Infinity)-(b.prix ?? Infinity) : filters.sort === "priceDesc" ? (b.prix ?? -1)-(a.prix ?? -1) : filters.sort === "newest" ? b.annee-a.annee : b.popularite-a.popularite), [deferredSearch, filters, products]);
  return <AppShell>
    <section className="catalog-hero"><span>{products.length} MODÈLES · DONNÉES DU CATALOGUE</span><h1>{t("catalog.title")}</h1><p>{t("catalog.subtitle")}</p></section>
    <div className="catalog-toolbar"><button className="button button-secondary mobile-filter-trigger" onClick={() => setFiltersOpen(true)}>{t("catalog.openFilters")}</button><strong>{filtered.length} {t("common.results")}</strong><label>{t("catalog.sort")}<select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort:event.target.value })}><option value="popular">{t("catalog.relevance")}</option><option value="priceAsc">{t("catalog.priceAsc")}</option><option value="priceDesc">{t("catalog.priceDesc")}</option><option value="newest">{t("catalog.newest")}</option></select></label></div>
    <div className="catalog-shell"><ProductFilters filters={filters} brands={brands} setFilters={(next) => { setFilters(next); setLimit(18); }} open={filtersOpen} setOpen={setFiltersOpen}/><section className="catalog-results">{filtered.length ? <ProductGrid products={filtered.slice(0,limit)} priorityCount={3}/> : <div className="no-results">{t("catalog.noResult")}</div>}{limit < filtered.length ? <button className="button button-secondary load-more" onClick={() => setLimit((value) => value + 18)}>{t("common.loadMore")}</button> : null}</section></div>
  </AppShell>;
}
