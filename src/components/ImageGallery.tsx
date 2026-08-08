"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProductImage } from "@/src/types/product";

export function ImageGallery({ images }: { images: ProductImage[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const current = images[active] ?? images[0]!;
  return <div className="image-gallery"><button className="gallery-main" onClick={() => setZoom(true)} aria-label={t("product.zoom")}><Image src={current.src} alt={current.alt} fill sizes="(max-width: 800px) 100vw, 55vw" priority/><span>{t("product.zoom")}</span></button><div className="gallery-thumbs">{images.map((image, index) => <button className={active === index ? "active" : ""} onClick={() => setActive(index)} key={`${image.src}-${image.view}`}><Image src={image.src} alt={image.alt} width={150} height={100} loading="lazy"/></button>)}</div>{zoom ? <div className="zoom-modal" role="dialog" aria-modal="true"><button onClick={() => setZoom(false)} aria-label={t("common.close")}>×</button><Image src={current.src} alt={current.alt} fill sizes="95vw"/></div> : null}</div>;
}
