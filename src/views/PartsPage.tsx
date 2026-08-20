import { AppShell } from "@/src/components/AppShell";
import type { SparePart } from "@/src/services/api";
import { formatPrice } from "@/src/utils/format";

export function PartsPage({ parts }: { parts:SparePart[] }) {
  return <AppShell><section className="catalog-hero"><span>PIÈCES ET CONSOMMABLES</span><h1>Pièces et accessoires agricoles</h1><p>Disponibilités et tarifs chargés directement depuis notre base de données.</p></section><section className="parts-catalog"><div className="parts-catalog-head"><div><span>CATALOGUE SAV</span><h2>{parts.length} références disponibles</h2><p>Confirmez la compatibilité avec notre équipe avant commande.</p></div></div>{parts.length ? <div className="spare-grid">{parts.map((part)=><article className="spare-card" key={part.reference}><div className="spare-visual"><b>{part.reference}</b><span>{part.stock_status === "available" ? `${part.stock_quantity} en stock` : "Sur commande"}</span></div><small>{part.category}</small><h3>{part.name}</h3><p>Compatible : {part.compatibility}</p><div><b>{formatPrice(Number(part.price_cents) / 100)}</b><a className="button button-secondary" href={`/quote-request?product=${encodeURIComponent(part.reference)}`}>Devis</a></div></article>)}</div>:<div className="no-results">Le catalogue de pièces est en cours de synchronisation.</div>}</section></AppShell>;
}
