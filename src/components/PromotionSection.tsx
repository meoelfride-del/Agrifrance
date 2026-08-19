import Link from "next/link";
import { financingOffers } from "@/src/data/promotions";

const displayDate = (date: string) => new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T00:00:00Z`));

export function PromotionSection() {
  return <section className="offers-section" aria-labelledby="offers-title">
    <div className="offers-heading"><span>OFFRES AGRIFRANCE — TRACTEURS AGRICOLES</span><h2 id="offers-title">Offres et promotions</h2><p>Deux solutions commerciales réservées aux tracteurs agricoles éligibles du catalogue AgriFrance.</p></div>
    <div className="offers-grid">{financingOffers.map((offer) => <article className="offer-card" key={offer.id}>
      <div className="offer-rate"><strong>0 %</strong><span>TAEG fixe</span></div>
      <div className="offer-copy"><span className="offer-duration">Pendant {offer.duration} mois</span>{offer.saving ? <h3>ET obtenez {offer.saving}</h3> : <h3>Financement à taux fixe</h3>}<p>sur les {offer.products}</p><time dateTime={offer.startsAt}>Du {displayDate(offer.startsAt)}</time><time dateTime={offer.endsAt}> au {displayDate(offer.endsAt)}</time><Link href={offer.catalogUrl}>Voir les tracteurs agricoles →</Link></div>
    </article>)}</div>
    <p className="offers-legal">Offres commerciales AgriFrance soumises à l’éligibilité du matériel, à l’acceptation du dossier par le partenaire financier et aux conditions complètes remises avant engagement. Le financement à 0 % n’est acquis qu’après validation écrite. Taxes, transport, assurance et frais éventuels peuvent s’appliquer. Aucun paiement ne doit être effectué sur la seule base de cette annonce.</p>
  </section>;
}
