import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "./Announcements.module.css";

import img1 from "../../assets/Yetttimg/yetti1.jpg";
import img2 from "../../assets/Yetttimg/yetti2jpg.jpg";
import img3 from "../../assets/Yetttimg/yettifuul.jpg";
import img4 from "../../assets/Yetttimg/yettiSkitch3.jpg";
import img5 from "../../assets/Yetttimg/yettiSkitch1.jpg";

// Edit the text here. Each item becomes one card.
const ITEMS = [
  {
    id: 1,
    category: "Yetti Announcements",
    title: "Our new season is officially here",
    description:
      "We are opening the doors to our newest collection, and we could not be more excited to share it with you.",
    image: img1,
    href: "#",
  },
  {
    id: 2,
    category: "Yetti Announcements",
    title: "Meet the team behind the brand",
    description:
      "A look at the people who design, build, and ship everything you love from Yetti, one day at a time.",
    image: img2,
    href: "#",
  },
  {
    id: 3,
    category: "Yetti Announcements",
    title: "A full look at what is coming next",
    description:
      "From new products to new places, here is everything we have planned for the months ahead of us.",
    image: img3,
    href: "#",
  },
  {
    id: 4,
    category: "Yetti Announcements",
    title: "Behind the scenes of our latest shoot",
    description:
      "We spent a full day on set capturing our newest pieces. Here is how it all came together on camera.",
    image: img4,
    href: "#",
  },
  {
    id: 5,
    category: "Yetti Announcements",
    title: "Highlights from our first sketch session",
    description:
      "The ideas, the laughs, and the early drafts that started it all. Take a peek at where Yetti began.",
    image: img5,
    href: "#",
  },
];

function Announcements() {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, [updateButtons]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className={styles.ann} aria-labelledby="ann-heading">
      <h2 className={styles.heading} id="ann-heading">
        Our latest announcements and stories
      </h2>

      <ul className={styles.track} ref={trackRef} onScroll={updateButtons}>
        {ITEMS.map((item) => (
          <li className={styles.card} key={item.id}>
            <a className={styles.link} href={item.href}>
              <span className={styles.category}>{item.category}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
              <div className={styles.media}>
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous announcements"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next announcements"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <span className={styles.count}>{ITEMS.length}</span>
      </div>
    </section>
  );
}

export default Announcements;