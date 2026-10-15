import React from "react";
import styles from "./Footer.module.css";

// Edit the links here. Swap "#" for your real routes or URLs.
const NAV = [
  { label: "Work", href: "#" },
  { label: "Meet Yetti", href: "#" },
  { label: "Stories", href: "#" },
  { label: "Heroes", href: "#" },
];

const LEGAL = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms of use", href: "#" },
  { label: "Contact us", href: "#" },
];

const SOCIALS = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.6c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5v3.2h2.8V21h3.2z" />
    ),
  },
  {
    name: "X",
    href: "#",
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  {
    name: "Instagram",
    href: "#",
    stroke: true,
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <path d="M6.94 21H3.2V9h3.74v12zM5.07 7.4a2.17 2.17 0 1 1 0-4.34 2.17 2.17 0 0 1 0 4.34zM21 21h-3.73v-5.84c0-1.39-.03-3.18-1.94-3.18-1.94 0-2.24 1.52-2.24 3.08V21H9.36V9h3.58v1.64h.05c.5-.94 1.72-1.94 3.54-1.94 3.78 0 4.47 2.49 4.47 5.72V21z" />
    ),
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <nav aria-label="Footer">
          <ul className={styles.nav}>
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.socials}>
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                className={styles.socialLink}
                aria-label={s.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className={s.stroke ? styles.stroke : undefined}
                >
                  {s.icon}
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.bottom}>
        <ul className={styles.legal}>
          {LEGAL.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={styles.legalLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.copy}>
          &copy; {year} Yetti. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;