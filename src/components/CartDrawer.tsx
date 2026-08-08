"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/src/context/CartContext";
import { formatPrice, whatsappUrl } from "@/src/utils/format";

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const cart = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", country: "Bénin" });
  const locale = i18n.resolvedLanguage ?? "fr";
  const message = [
    "Bonjour AgriFrance, je souhaite commander :",
    ...cart.items.map((item) => `- ${item.product.nom} × ${item.quantity} : ${formatPrice(item.product.prix * item.quantity, locale)}`),
    `Total estimé : ${formatPrice(cart.total, locale)}`,
    `Client : ${customer.name || "À préciser"}`,
    `Pays : ${customer.country}`,
    `Téléphone : ${customer.phone || "À préciser"}`,
    `E-mail : ${customer.email || "À préciser"}`,
  ].join("\n");
  return <>
    {cart.isOpen ? <button className="drawer-backdrop" aria-label={t("common.close")} onClick={() => cart.setOpen(false)} /> : null}
    <aside className={`cart-drawer ${cart.isOpen ? "open" : ""}`} aria-hidden={!cart.isOpen} aria-label={t("cart.title")}>
      <div className="drawer-head"><h2>{t("cart.title")}</h2><button onClick={() => cart.setOpen(false)} aria-label={t("common.close")}>×</button></div>
      <div className="drawer-items">
        {!cart.items.length ? <div className="cart-empty"><p>{t("cart.empty")}</p><Link href="/catalog" onClick={() => cart.setOpen(false)}>{t("home.primary")}</Link></div> : null}
        {cart.items.map((item) => <article className="cart-item" key={item.productId}>
          <Image src={item.product.images[0]!.src} alt={item.product.images[0]!.alt} width={96} height={72} />
          <div><strong>{item.product.nom}</strong><small>{formatPrice(item.product.prix, locale)}</small><label>{t("common.quantity")}<input type="number" min="1" max="99" value={item.quantity} onChange={(event) => cart.updateQuantity(item.productId, Number(event.target.value))}/></label></div>
          <button className="remove-item" onClick={() => cart.removeItem(item.productId)}>{t("cart.remove")}</button>
        </article>)}
      </div>
      {cart.items.length ? <div className="cart-summary">
        <p><span>{t("common.subtotal")}</span><b>{formatPrice(cart.subtotal, locale)}</b></p>
        <p><span>{t("common.shipping")}</span><b>{formatPrice(cart.shipping, locale)}</b></p>
        <p className="cart-total"><span>{t("common.total")}</span><b>{formatPrice(cart.total, locale)}</b></p>
        <div className="cart-customer">
          <input aria-label={t("cart.name")} placeholder={t("cart.name")} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })}/>
          <input aria-label={t("cart.phone")} placeholder={t("cart.phone")} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}/>
          <input type="email" aria-label={t("cart.email")} placeholder={t("cart.email")} value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })}/>
          <input aria-label={t("cart.country")} placeholder={t("cart.country")} value={customer.country} onChange={(event) => setCustomer({ ...customer, country: event.target.value })}/>
        </div>
        <a className="button button-whatsapp" href={whatsappUrl(message)} target="_blank" rel="noreferrer">{t("cart.orderWhatsapp")}</a>
      </div> : null}
    </aside>
  </>;
}
