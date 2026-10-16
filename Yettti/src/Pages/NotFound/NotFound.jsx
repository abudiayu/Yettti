import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

// Edit these to match the pages that exist on your site
const helpfulLinks = [
  { label: '< Home To Site?.', to: '/' },
]

function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        {/* Left: text */}
        <section className={styles.content} aria-labelledby="notfound-title">
          <h1 id="notfound-title" className={styles.oops}>
            Oops!
          </h1>

          <h2 className={styles.message}>
            We can&apos;t seem to find the page you&apos;re looking for.
          </h2>

          <p className={styles.code}>Error code: 404</p>

          <p className={styles.helpText}>Here are some helpful links instead:</p>

          <ul className={styles.links}>
            {helpfulLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Right: illustration */}
        <div className={styles.illustration} aria-hidden="true">
          <svg viewBox="0 0 300 390" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="dressClip">
                <path d="M112 172 L188 172 L197 268 L103 268 Z" />
              </clipPath>
            </defs>

            {/* Ground shadow */}
            <ellipse cx="150" cy="372" rx="128" ry="15" fill="#d2d2d7" />

            {/* Dropped ice cream splat */}
            <g fill="#f8727a">
              <ellipse cx="252" cy="367" rx="36" ry="7" />
              <circle cx="238" cy="359" r="8" />
              <circle cx="255" cy="355" r="10" />
              <circle cx="270" cy="361" r="7" />
            </g>

            {/* Legs */}
            <rect x="118" y="266" width="20" height="76" fill="#5b2a6e" />
            <rect x="162" y="266" width="20" height="76" fill="#5b2a6e" />

            {/* Socks */}
            <rect x="118" y="334" width="20" height="9" fill="#f4a3b0" />
            <rect x="162" y="334" width="20" height="9" fill="#f4a3b0" />

            {/* Shoes */}
            <rect x="110" y="343" width="34" height="15" rx="7.5" fill="#1f9e9a" />
            <rect x="156" y="343" width="34" height="15" rx="7.5" fill="#1f9e9a" />

            {/* Left arm (hanging) */}
            <path
              d="M102 190 L99 246"
              stroke="#f9a98b"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            {/* Neck */}
            <rect x="142" y="148" width="16" height="28" fill="#f9a98b" />

            {/* Dress with stripes */}
            <g clipPath="url(#dressClip)">
              <rect x="100" y="170" width="100" height="100" fill="#2ec4b6" />
              <rect x="100" y="200" width="100" height="14" fill="#5b2a6e" />
              <rect x="100" y="228" width="100" height="14" fill="#5b2a6e" />
              <rect x="100" y="256" width="100" height="14" fill="#5b2a6e" />
            </g>

            {/* Buttons */}
            <circle cx="150" cy="184" r="3.5" fill="#5b2a6e" />
            <circle cx="150" cy="195" r="3.5" fill="#5b2a6e" />

            {/* Sleeves */}
            <path d="M112 172 L95 182 L99 204 L117 197 Z" fill="#5b2a6e" />
            <path d="M188 172 L205 182 L201 204 L183 197 Z" fill="#5b2a6e" />

            {/* Right arm (bent, holding cone) */}
            <path
              d="M196 192 Q222 206 224 172"
              stroke="#f9a98b"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cone */}
            <polygon points="212,128 248,142 226,178" fill="#f6a623" />
            <polygon points="212,128 248,142 240,146 216,134" fill="#f9bd4f" />

            {/* Hand */}
            <circle cx="224" cy="172" r="7.5" fill="#f9a98b" />

            {/* Head */}
            <circle cx="150" cy="108" r="46" fill="#f9a98b" />

            {/* Hair bun */}
            <circle cx="150" cy="36" r="22" fill="#17858a" />

            {/* Hair */}
            <path
              d="M104 112 C98 62 128 52 150 52 C174 52 202 62 196 112 C190 90 174 78 150 78 C126 78 110 92 104 112 Z"
              fill="#17858a"
            />

            {/* Bow */}
            <g transform="translate(108 66) rotate(-18)">
              <path d="M0 0 L16 9 L0 18 Z" fill="#ffd23f" />
              <path d="M32 0 L16 9 L32 18 Z" fill="#ffd23f" />
              <path
                d="M5 5 L10 9 L6 12"
                stroke="#f6a623"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="13" y="5" width="6" height="8" rx="2" fill="#f6a623" />
            </g>

            {/* Eyebrows (sad) */}
            <path
              d="M126 103 L143 97"
              stroke="#3b2a3a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M174 103 L157 97"
              stroke="#3b2a3a"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Eyes */}
            <circle cx="135" cy="113" r="3" fill="#3b2a3a" />
            <circle cx="165" cy="113" r="3" fill="#3b2a3a" />

            {/* Cheeks */}
            <ellipse cx="126" cy="126" rx="7" ry="5" fill="#f4727f" opacity="0.75" />
            <ellipse cx="174" cy="126" rx="7" ry="5" fill="#f4727f" opacity="0.75" />

            {/* Mouth (frown) */}
            <path
              d="M138 138 Q150 126 162 138"
              stroke="#c4343f"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </main>
  )
}

export default NotFound;