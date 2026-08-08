"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCart } from "@/src/context/CartContext";
import { formatPrice } from "@/src/utils/format";
import type { Product } from "@/src/types/product";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  return <article className="product-card-new">
    <Link className="product-card-image" href={`/produits/${product.categorySlug}/${product.slug}`}>
      <Image src={product.images[0]!.src} alt={product.images[0]!.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw" priority={priority} loading={priority ? "eager" : "lazy"}/>
      <span className="image-disclaimer">{t("common.demoImage")}</span>
      {product.promotion ? <b className="product-badge promotion">{t("common.promotion")}</b> : product.vedette ? <b className="product-badge">{t("common.popular")}</b> : null}
    </Link>
    <div className="product-card-body"><small>{product.categorie} · {product.marque}</small><h3><Link href={`/produits/${product.categorySlug}/${product.slug}`}>{product.nom}</Link></h3><p>{t("catalog.description")}</p>
      <dl><div><dt>{t("catalog.power")}</dt><dd>{product.puissance}</dd></div><div><dt>{t("catalog.year")}</dt><dd>{product.annee}</dd></div><div><dt>{t("catalog.condition")}</dt><dd>{product.etat}</dd></div></dl>
      <div className="product-price"><span>{t("common.indicative")}</span>{product.ancienPrix ? <del>{formatPrice(product.ancienPrix, i18n.resolvedLanguage)}</del> : null}<strong>{formatPrice(product.prix, i18n.resolvedLanguage)}</strong></div>
      <div className="product-actions"><Link className="button button-secondary" href={`/produits/${product.categorySlug}/${product.slug}`}>{t("common.view")}</Link><button className="button button-primary" onClick={() => addItem(product.id)} disabled={!product.disponible}>{t("common.addCart")}</button></div>
    </div>
  </article>;
}
