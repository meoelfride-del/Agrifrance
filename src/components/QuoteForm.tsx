"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { products } from "@/src/data/products";

type QuoteValues = { name:string; phone:string; email:string; country:string; product:string; quantity:string; budget:string; message:string; contact:string; privacy:boolean };
const initialValues: QuoteValues = { name:"",phone:"",email:"",country:"Bénin",product:"",quantity:"1",budget:"",message:"",contact:"WhatsApp",privacy:false };

export function QuoteForm({ initialProduct = "" }: { initialProduct?: string }) {
  const { t } = useTranslation();
  const [values, setValues] = useState({ ...initialValues, product: initialProduct });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (key:keyof QuoteValues, value:string|boolean) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const next: Record<string,string> = {};
    for (const key of ["name","phone","email","country","product"] as const) if (!values[key].trim()) next[key] = t("common.required");
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = t("common.invalidEmail");
    if (!values.privacy) next.privacy = t("common.required");
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    window.setTimeout(() => { setSending(false); setSent(true); setValues({ ...initialValues, product: initialProduct }); }, 700);
  };
  if (sent) return <div className="form-success" role="status"><strong>✓</strong><h2>{t("common.success")}</h2><button className="button button-secondary" onClick={() => setSent(false)}>{t("common.continue")}</button></div>;
  return <form className="quote-form-new" onSubmit={submit} noValidate><div className="form-grid">
    <Field label={t("quote.name")} error={errors.name}><input value={values.name} onChange={(event) => set("name",event.target.value)} autoComplete="name"/></Field>
    <Field label={t("quote.phone")} error={errors.phone}><input value={values.phone} onChange={(event) => set("phone",event.target.value)} autoComplete="tel" inputMode="tel"/></Field>
    <Field label={t("quote.email")} error={errors.email}><input type="email" value={values.email} onChange={(event) => set("email",event.target.value)} autoComplete="email"/></Field>
    <Field label={t("quote.country")} error={errors.country}><input value={values.country} onChange={(event) => set("country",event.target.value)} autoComplete="country-name"/></Field>
    <Field label={t("quote.product")} error={errors.product}><select value={values.product} onChange={(event) => set("product",event.target.value)}><option value="">{t("quote.choose")}</option>{products.map((product) => <option value={product.id} key={product.id}>{product.nom}</option>)}</select></Field>
    <Field label={t("common.quantity")}><input type="number" min="1" max="99" value={values.quantity} onChange={(event) => set("quantity",event.target.value)}/></Field>
    <Field label={t("quote.budget")}><input type="number" min="0" value={values.budget} onChange={(event) => set("budget",event.target.value)}/></Field>
    <Field label={t("quote.contact")}><select value={values.contact} onChange={(event) => set("contact",event.target.value)}><option>{t("quote.whatsapp")}</option><option>{t("quote.phoneContact")}</option><option>{t("quote.emailContact")}</option></select></Field>
  </div><Field label={t("quote.message")}><textarea rows={5} value={values.message} onChange={(event) => set("message",event.target.value)}/></Field>
  <label className="privacy-check"><input type="checkbox" checked={values.privacy} onChange={(event) => set("privacy",event.target.checked)}/><span>{t("quote.privacy")}{errors.privacy ? <small role="alert">{errors.privacy}</small> : null}</span></label>
  <button className="button button-primary form-submit" type="submit" disabled={sending}>{sending ? t("quote.duplicate") : t("common.send")}</button></form>;
}

function Field({ label, error, children }: { label:string; error?:string; children:React.ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}{error ? <small role="alert">{error}</small> : null}</label>;
}
