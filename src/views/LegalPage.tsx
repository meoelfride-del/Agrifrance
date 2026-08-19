"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/src/components/AppShell";

type LegalType = "privacy" | "rights" | "complaints" | "terms" | "cookies" | "notices";

const updatedAt = "19 août 2026";

function ContactBlock() {
  return <aside className="legal-contact"><h2>Nous contacter</h2><p>AgriFrance Machines — Cotonou, Bénin<br/><a href="mailto:contact@agrifrance.bj">contact@agrifrance.bj</a> · <a href="tel:+2290197000000">+229 01 97 00 00 00</a></p></aside>;
}

const pages: Record<LegalType, { title:string; intro:string; sections:Array<[string, ReactNode]> }> = {
  privacy: { title:"Politique de confidentialité et des données", intro:"Cette politique explique quelles données AgriFrance traite, pourquoi elles sont utilisées et comment exercer vos droits.", sections:[
    ["Données traitées", <p key="p">Identité et coordonnées, contenu des demandes, informations de livraison et de commande, préférences linguistiques, panier local, données techniques de connexion et échanges avec notre équipe. Nous ne demandons jamais vos mots de passe ni vos données bancaires par le formulaire de devis.</p>],
    ["Finalités et bases juridiques", <ul key="l"><li>Répondre à un devis, préparer et exécuter une commande ou une livraison.</li><li>Respecter nos obligations comptables, fiscales et de sécurité.</li><li>Prévenir la fraude et améliorer le service sur la base de notre intérêt légitime.</li><li>Envoyer une communication commerciale uniquement avec votre consentement lorsqu’il est requis.</li></ul>],
    ["Destinataires et transferts", <p key="p">L’accès est limité aux équipes habilitées et, si nécessaire, aux prestataires d’hébergement, paiement, transport, maintenance ou financement liés à votre demande. Nous exigeons un cadre contractuel et des mesures adaptées lorsqu’un traitement ou transfert est confié à un tiers.</p>],
    ["Conservation et sécurité", <p key="p">Les données sont conservées pendant la durée nécessaire à la demande, au contrat et aux délais légaux applicables, puis supprimées ou anonymisées. AgriFrance applique des contrôles d’accès, sauvegardes et mesures de sécurité proportionnés aux risques.</p>],
    ["Vos droits", <p key="p">Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, la portabilité ou vous opposer à certains traitements. Vous pouvez retirer votre consentement sans affecter les traitements antérieurs. Consultez la page <Link href="/legal/data-rights">Exercer mes droits</Link>.</p>],
    ["Réclamation", <p key="p">Si notre réponse ne vous satisfait pas, vous pouvez suivre notre <Link href="/legal/complaints">procédure de réclamation</Link> et saisir l’autorité de protection des données compétente de votre lieu de résidence ou de travail.</p>],
  ]},
  rights: { title:"Exercer vos droits sur les données", intro:"AgriFrance facilite l’exercice de vos droits et répond dans le délai prévu par la réglementation applicable.", sections:[
    ["Droits disponibles", <p key="p">Accès, rectification, effacement, limitation, opposition, portabilité, retrait du consentement et demande d’intervention humaine lorsqu’une décision automatisée produirait un effet important. AgriFrance ne prend actuellement aucune décision commerciale uniquement automatisée.</p>],
    ["Envoyer une demande", <p key="p">Écrivez à <a href="mailto:contact@agrifrance.bj?subject=Exercice%20de%20mes%20droits">contact@agrifrance.bj</a> avec l’objet « Exercice de mes droits », le droit concerné et les informations permettant de retrouver votre demande. Ne transmettez une pièce d’identité que si nous la demandons et seulement par le canal sécurisé indiqué.</p>],
    ["Vérification et réponse", <p key="p">Nous pouvons vérifier votre identité afin de protéger vos données. La réponse est fournie gratuitement sauf demande manifestement infondée ou excessive, dans les limites autorisées par la loi.</p>],
  ]},
  complaints: { title:"Réclamations et droit de plainte", intro:"Vous pouvez signaler un problème relatif à une commande, au service ou à l’utilisation de vos données.", sections:[
    ["Réclamation auprès d’AgriFrance", <ol key="l"><li>Décrivez les faits, la date, la référence concernée et la solution attendue.</li><li>Envoyez votre demande à <a href="mailto:contact@agrifrance.bj?subject=Réclamation">contact@agrifrance.bj</a>.</li><li>Nous accusons réception et vous informons du suivi et du délai estimé.</li></ol>],
    ["Protection des données", <p key="p">Pour une plainte relative aux données personnelles, indiquez clairement « Confidentialité » dans l’objet. Si la réponse reste insatisfaisante, vous conservez le droit de saisir l’autorité de contrôle compétente, sans préjudice de tout autre recours administratif ou juridictionnel.</p>],
    ["Aucune représaille", <p key="p">L’exercice de bonne foi d’un droit ou le dépôt d’une plainte ne doit entraîner aucune discrimination ni dégradation injustifiée du service.</p>],
  ]},
  terms: { title:"Conditions d’utilisation du site", intro:"En utilisant ce site, vous acceptez les règles ci-dessous. Les conditions particulières d’un devis ou contrat signé prévalent pour la vente.", sections:[
    ["Informations et disponibilité", <p key="p">Nous cherchons à publier des informations exactes, mais les caractéristiques, images, stocks et délais peuvent évoluer. Les prix sont indicatifs, hors taxes sauf mention contraire, et peuvent varier selon la configuration, les options, le transport et le pays de livraison.</p>],
    ["Commandes et financement", <p key="p">Une demande en ligne ne vaut pas acceptation. La vente ou le financement devient ferme uniquement après vérification, remise des conditions complètes, acceptation du dossier, signature et paiement convenu. N’envoyez jamais d’argent à un compte non confirmé sur un document officiel AgriFrance.</p>],
    ["Usage autorisé", <p key="p">Vous ne devez pas contourner la sécurité, perturber le service, extraire massivement le catalogue, usurper une identité, publier un contenu illicite ou utiliser nos marques et contenus sans autorisation.</p>],
    ["Propriété intellectuelle et liens tiers", <p key="p">La structure du site, les créations AgriFrance, textes et signes distinctifs sont protégés. Les marques et modèles de constructeurs appartiennent à leurs titulaires. Les services tiers restent soumis à leurs propres conditions.</p>],
    ["Responsabilité et évolution", <p key="p">AgriFrance reste responsable dans les limites prévues par la loi applicable. Nous pouvons corriger, suspendre ou faire évoluer le site et ces conditions, sans supprimer les droits déjà acquis par un contrat.</p>],
  ]},
  cookies: { title:"Politique relative aux cookies", intro:"Le site limite le stockage aux fonctions utiles et vous informe avant tout ajout de mesure d’audience ou de publicité.", sections:[
    ["Stockage nécessaire", <p key="p">Le stockage local mémorise notamment la langue, le panier et certaines préférences. Ces éléments sont nécessaires au fonctionnement demandé et peuvent être effacés dans les réglages du navigateur.</p>],
    ["Mesure d’audience et publicité", <p key="p">Aucun cookie publicitaire n’est requis pour parcourir le catalogue. Si un outil non essentiel est ajouté, un choix clair sera proposé avant son activation et pourra être retiré à tout moment.</p>],
    ["Vos choix", <p key="p">Vous pouvez bloquer ou supprimer les cookies via votre navigateur. Certaines fonctions, comme la conservation du panier, peuvent alors ne plus fonctionner entre deux visites.</p>],
  ]},
  notices: { title:"Mentions légales", intro:"Informations relatives à l’éditeur et au fonctionnement du service AgriFrance.", sections:[
    ["Éditeur", <p key="p"><strong>AgriFrance Machines</strong><br/>Activité : vente et accompagnement de machines et équipements agricoles<br/>Localisation : Cotonou, Bénin<br/>E-mail : contact@agrifrance.bj<br/>Téléphone : +229 01 97 00 00 00</p>],
    ["Informations d’entreprise", <p key="p">La forme juridique, le capital, le numéro d’immatriculation, l’identifiant fiscal, l’adresse complète du siège et le nom du responsable de publication doivent être ajoutés ici par le représentant légal avant la mise en production commerciale.</p>],
    ["Hébergement", <p key="p">Le service web est destiné à être hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis. L’environnement effectif de production doit être vérifié après déploiement.</p>],
    ["Contact et signalement", <p key="p">Pour signaler un contenu, un problème de sécurité ou une atteinte à vos droits, utilisez les coordonnées ci-dessus et décrivez précisément la page concernée.</p>],
  ]},
};

export function LegalPage({ type }: { type:LegalType }) {
  const page = pages[type];
  return <AppShell><article className="legal-page"><span className="legal-updated">Mis à jour le {updatedAt}</span><h1>{page.title}</h1><p className="legal-intro">{page.intro}</p>{page.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2>{body}</section>)}<ContactBlock/></article></AppShell>;
}
