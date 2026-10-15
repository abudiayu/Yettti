import React, { useState } from "react";
import styles from "./Partners.module.css";

/*
  TEMPORARY: logos are loaded from the internet by company website (domain).
  Add or remove partners in this list. Each entry needs a name and a domain.
  If you later want your own file for one partner, add  logo: importedImage
  to that entry and it will be used instead of the online logo.

  A few domains below are my best guess (marked "check") — fix them if a
  logo looks wrong. A logo that can't be found falls back to a smaller
  site icon, and then to the partner's name as text.
*/
const PARTNERS = [
  { name: "Mastercard Foundation", domain: "mastercardfdn.org" },
  { name: "GIZ", domain: "giz.de" },
  { name: "Ministry of Innovation and Technology", domain: "mint.gov.et" },
  { name: "Italian Agency for Development Cooperation", domain: "aics.gov.it" },
  { name: "British Council", domain: "britishcouncil.org" },
  { name: "Input Output", domain: "iohk.io" },
  { name: "European Union", domain: "europa.eu" },
  { name: "UNIDO", domain: "unido.org" },
  { name: "Huawei", domain: "huawei.com" },
  { name: "Addis Ababa University", domain: "aau.edu.et" },
  { name: "Ministry of Labor and Skills", domain: "mols.gov.et" }, // check
  { name: "Orange", domain: "orange.com" },
  { name: "gig", domain: "gig.com" }, // check
  { name: "AfriLabs", domain: "afrilabs.com" },
  { name: "Alliance Fran\u00E7aise", domain: "alliancefr.org" },
  { name: "Ministry of Education", domain: "moe.gov.et" },
  { name: "Aqua for All", domain: "aquaforall.nl" },
  { name: "IFC", domain: "ifc.org" },
  { name: "Friedrich Ebert Stiftung", domain: "fes.de" },
  { name: "#i4Policy", domain: "i4policy.org" },
  { name: "DW Akademie", domain: "dw.com" },
  { name: "Goethe-Institut", domain: "goethe.de" },
  { name: "The Indigo Trust", domain: "indigotrust.org.uk" },
  { name: "VC4A", domain: "vc4a.com" },
  { name: "Facebook", domain: "facebook.com" },
  { name: "Reach for Change", domain: "reachforchange.org" },
  { name: "Adaverse", domain: "adaverse.com" }, // check
  { name: "IREX", domain: "irex.org" },
  { name: "sequa", domain: "sequa.de" },
  { name: "WFP", domain: "wfp.org" },
  { name: "Aspen Network of Development Entrepreneurs", domain: "andeglobal.org" },
];

// Online logo sources, tried in order.
const logoSources = (domain) => [
  `https://logo.debounce.com/${domain}`,
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
];

function PartnerLogo({ partner }) {
  const [attempt, setAttempt] = useState(0);
  const sources = partner.logo ? [partner.logo] : logoSources(partner.domain);

  if (attempt >= sources.length) {
    // Nothing loaded: show the name so the cell is never empty
    return <span className={styles.fallbackName}>{partner.name}</span>;
  }

  return (
    <img
      className={styles.logo}
      src={sources[attempt]}
      alt={partner.name}
      loading="lazy"
      decoding="async"
      draggable="false"
      referrerPolicy="no-referrer"
      onError={() => setAttempt((n) => n + 1)}
    />
  );
}

function Partners({
  title = "Who Supports This Journey?",
  subtitle = "We work along side our partners to get everything we need to help you.",
}) {
  return (
    <section className={styles.section} aria-labelledby="partners-title">
      <header className={styles.header}>
        <h2 id="partners-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>

      <ul className={styles.grid}>
        {PARTNERS.map((partner) => (
          <li key={partner.domain} className={styles.cell}>
            <PartnerLogo partner={partner} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Partners;