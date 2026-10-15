import React from "react";
import styles from "./Hero.module.css";

// Image file names are exactly as they appear in src/assets/Yettiimg.
// Tip: rename "yettin skitche2.jpg" to something without spaces (e.g. yettiSketch2.jpg)
// and update the import below.
import sketch1 from "../../assets/Yetttimg/yettiSkitch1.jpg";
import sketch2 from "../../assets/Yetttimg/yettiSkitche2.jpg";
import sketch3 from "../../assets/Yetttimg/yettiSkitch3.jpg";

const PANELS = [
  { src: sketch1, alt: "Yetti sketch, first illustration" },
  { src: sketch2, alt: "Yetti sketch, second illustration" },
  { src: sketch3, alt: "Yetti sketch, third illustration" },
];

function Hero({ title = "Meet Yetti", subtitle = "" }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.collage}>
        {PANELS.map((panel, index) => (
          <div key={panel.src} className={`${styles.panel} ${styles[`panel${index + 1}`]}`}>
            <img
              src={panel.src}
              alt={panel.alt}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <div className={styles.caption}>
        <h1 id="hero-title" className={styles.title}>
          {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}

export default Hero;