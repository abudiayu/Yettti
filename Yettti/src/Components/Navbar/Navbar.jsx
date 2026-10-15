import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import promoImg from "../../assets/Yetttimg/yettifuul.jpg";
import promoImg2 from "../../assets/Yetttimg/yettiSkitch3.jpg"
import promoImg3 from "../../assets/Yetttimg/yettiSkitche2.jpg"
import promoImg4 from "../../assets/Yetttimg/demera.jpg"

/*
  Edit this array to change the nav links.
  - A link with only `label` + `href` is a normal link.
  - A link with `menu` opens the big dropdown panel (like "Books" on Gates Notes).
*/
const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    menu: {
      title: "Explore Yetti",
      columns: [
        [
          { label: "Welcome", href: "/" },
          { label: "Latest stories", href: "/friends/stories" },
          { label: "About Yetti", href: "/#about" },
          { label: "Contact", href: "/#contact" },
        ],
      ],
      promo: {
        image: promoImg,
        eyebrow: "Become an insider",
        title: "Sign up to our newsletter",
        href: "/signup",
      },
      cta: { label: "Sign up to get our newsletter", href: "/signup" },
    },
  },
  {
    label: "Family",
    href: "/family",
    menu: {
      title: "Explore family",
      columns: [
        [
          { label: "All family", href: "/family" },
          { label: "Parents", href: "/family/parents" },
          { label: "Siblings", href: "/family/siblings" },
          { label: "Relatives", href: "/family/relatives" },
        ],
      ],
      promo: {
        image: promoImg2,
        eyebrow: "Become an insider",
        title: "Sign up to our newsletter",
        href: "/signup",
      },
      cta: { label: "Sign up to get our newsletter", href: "/signup" },
    },
  },
  {
    label: "Friends",
    href: "/friends",
    menu: {
      title: "Explore friends",
      columns: [
        [
          { label: "All friends", href: "/friends" },
          { label: "Childhood", href: "/friends/childhood" },
          { label: "School", href: "/friends/school" },
          { label: "Neighbours", href: "/friends/neighbours" },
        ],
        [
          { label: "Travel", href: "/friends/travel" },
          { label: "Stories", href: "/friends/stories" },
          { label: "Photos", href: "/friends/photos" },
          { label: "Sketches", href: "/friends/sketches" },
        ],
      ],
      promo: {
        image: promoImg3,
        eyebrow: "Become an insider",
        title: "Sign up to our newsletter",
        href: "/signup",
      },
      cta: { label: "Sign up to get our newsletter", href: "/signup" },
    },
  },
  {
    label: "Partners",
    href: "/partners",
    menu: {
      title: "Explore partners",
      columns: [
        [
          { label: "All partners", href: "/partners" },
          { label: "Become a partner", href: "/partners/join" },
          { label: "Supporters", href: "/partners/supporters" },
          { label: "Contact us", href: "/#contact" },
        ],
      ],
      promo: {
        image: promoImg4,
        eyebrow: "Become an insider",
        title: "Sign up to our newsletter",
        href: "/signup",
      },
      cta: { label: "Sign up to get our newsletter", href: "/signup" },
    },
  },
];

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null); // index of the open dropdown
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);
  const closeTimer = useRef(null);

  // Close everything on Escape or on a click outside the header
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    const onClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  // Focus the search input when it opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;

  const handleEnter = (index) => {
    if (!isDesktop()) return;
    clearTimeout(closeTimer.current);
    setSearchOpen(false);
    setOpenMenu(index);
  };

  const handleLeave = () => {
    if (!isDesktop()) return;
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const toggleMenu = (index) => {
    setSearchOpen(false);
    setOpenMenu((current) => (current === index ? null : index));
  };

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setOpenMenu(null);
    setSearchOpen((v) => !v);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Replace with your own search logic / navigate()
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  };

  return (
    <header className={styles.header} ref={headerRef}>
      {/* Frosted page backdrop shown behind the open dropdown (desktop) */}
      <div
        className={`${styles.backdrop} ${openMenu !== null ? styles.backdropOpen : ""}`}
        aria-hidden="true"
      />

      <div className={styles.wrap}>
        {/* Logo */}
        <a href="/" className={styles.logo} onClick={closeAll} aria-label="Yetti home">
          <span>Yetti</span>
          <span>Stories</span>
        </a>

        {/* Main links */}
        <nav
          className={`${styles.bar} ${mobileOpen ? styles.barOpen : ""}`}
          aria-label="Main navigation"
        >
          <ul className={styles.links}>
            {NAV_ITEMS.map((item, index) => {
              const hasMenu = Boolean(item.menu);
              const isOpen = openMenu === index;

              return (
                <li
                  key={item.label}
                  className={styles.item}
                  onMouseEnter={() => (hasMenu ? handleEnter(index) : null)}
                  onMouseLeave={hasMenu ? handleLeave : undefined}
                >
                  {hasMenu ? (
                    <button
                      type="button"
                      className={`${styles.link} ${styles.linkButton} ${isOpen ? styles.linkActive : ""}`}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => toggleMenu(index)}
                    >
                      {item.label}
                      <svg
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <a href={item.href} className={styles.link} onClick={closeAll}>
                      {item.label}
                    </a>
                  )}

                  {hasMenu && (
                    <div
                      className={`${styles.mega} ${isOpen ? styles.megaOpen : ""}`}
                      onMouseEnter={() => handleEnter(index)}
                      onMouseLeave={handleLeave}
                    >
                      <div className={styles.megaInner}>
                        <div className={styles.megaLeft}>
                          <h3 className={styles.megaTitle}>{item.menu.title}</h3>
                          <div className={styles.megaRule} />
                          <div className={styles.megaColumns}>
                            {item.menu.columns.map((col, i) => (
                              <ul key={i} className={styles.megaList}>
                                {col.map((sub) => (
                                  <li key={sub.label}>
                                    <a href={sub.href} onClick={closeAll}>
                                      {sub.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ))}
                          </div>
                          {item.menu.cta && (
                            <a href={item.menu.cta.href} className={styles.cta} onClick={closeAll}>
                              <span>{item.menu.cta.label}</span>
                              <svg
                                className={styles.ctaArrow}
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                aria-hidden="true"
                              >
                                <path
                                  d="M7 17L17 7M9 7h8v8"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </a>
                          )}
                        </div>

                        {item.menu.promo && (
                          <a
                            href={item.menu.promo.href}
                            className={styles.promo}
                            onClick={closeAll}
                          >
                            <span className={styles.promoEyebrow}>{item.menu.promo.eyebrow}</span>
                            <span className={styles.promoTitle}>{item.menu.promo.title}</span>
                            <span className={styles.promoImgWrap}>
                              <img src={item.menu.promo.image} alt="" />
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search button */}
        <button
          type="button"
          className={styles.iconBox}
          onClick={toggleSearch}
          aria-label={searchOpen ? "Close search" : "Open search"}
          aria-expanded={searchOpen}
        >
          {searchOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M15.5 15.5L21 21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`${styles.iconBox} ${styles.burger}`}
          onClick={() => {
            setOpenMenu(null);
            setSearchOpen(false);
            setMobileOpen((v) => !v);
          }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className={`${styles.burgerLines} ${mobileOpen ? styles.burgerLinesOpen : ""}`} />
        </button>
      </div>

      {/* Search panel */}
      <div className={`${styles.searchPanel} ${searchOpen ? styles.searchPanelOpen : ""}`}>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Yetti"
            aria-label="Search"
            tabIndex={searchOpen ? 0 : -1}
          />
          <button type="submit" tabIndex={searchOpen ? 0 : -1}>
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Navbar;