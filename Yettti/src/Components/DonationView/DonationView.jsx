import React, { useEffect, useRef } from "react";
import styles from "./DonationView.module.css";

// Images come from src/assets/Yettiimg. Swap any of them for your own.
import imgGiving from "../../assets/Yetttimg/yetti1.jpg";
import imgFamilies from "../../assets/Yetttimg/yetti2jpg.jpg";
import imgPartners from "../../assets/Yetttimg/demera.jpg";
import imgFriends from "../../assets/Yetttimg/yettiSkitch1.jpg";
import imgStories from "../../assets/Yetttimg/yettiSkitche2.jpg";
/*
  The intro paragraph is built from this list.
  - "text" parts render as grey text.
  - "link" parts render as bold black text + a small thumbnail, and navigate to `href`.
  Edit the words, the hrefs and the images here.
*/
const INTRO = [
  { type: "text", value: "Read about our approach to " },
  { type: "link", label: "giving", href: "/donate", image: imgGiving },
  { type: "text", value: " and how each donation reaches " },
  { type: "link", label: "families", href: "/family", image: imgFamilies },
  { type: "text", value: ". Meet the " },
  { type: "link", label: "partners", href: "/partners", image: imgPartners },
  { type: "text", value: " who stand beside us. Giving isn\u2019t only money. We\u2019re grateful for " },
  { type: "link", label: "our friends", href: "/friends", image: imgFriends },
  { type: "text", value: " and the " },
  { type: "link", label: "stories", href: "/stories", image: imgStories },
  { type: "text", value: " we share together." },
];

const FEATURE = {
  image: imgPartners,
  eyebrow: "Our giving",
  title: "Every donation goes straight to the people who need it",
  text:
    "From the first day we have kept our promise: what you give is what arrives. Read how your support reaches families and partners.",
  href: "/donate",
};

/*
  Put your donation video in the project's `public/videos/` folder and name it
  donation.mp4 (so the file is public/videos/donation.mp4).
  Files in `public/` are referenced by a plain path starting with "/".
*/
const SIDE = {
  video: "/videos/donation.mp4",
  poster: imgFriends, // shown until the video loads
  text:
    "See the stories behind the sketches and meet the friends who make this work possible.",
  href: "/stories",
};

function DonationView() {
  const videoRef = useRef(null);

  // Play the video only while it is on screen, and never autoplay
  // for people who have "reduce motion" turned on.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.pause();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {}); // browser blocked autoplay, poster stays visible
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-labelledby="donation-intro">
      <div className={styles.inner}>
        {/* ---------- Intro paragraph ---------- */}
        <p id="donation-intro" className={styles.intro}>
          {INTRO.map((part, index) =>
            part.type === "text" ? (
              <span key={index}>{part.value}</span>
            ) : (
              <a key={index} href={part.href} className={styles.inlineLink}>
                <strong>{part.label}</strong>
                <img
                  className={styles.thumb}
                  src={part.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </a>
            )
          )}
        </p>

        {/* ---------- Feature cards ---------- */}
        <div className={styles.cards}>
          <a href={FEATURE.href} className={`${styles.card} ${styles.cardMain}`}>
            <img
              className={styles.cardImage}
              src={FEATURE.image}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <div className={styles.overlay}>
              <span className={styles.eyebrow}>{FEATURE.eyebrow}</span>
              <h2 className={styles.cardTitle}>{FEATURE.title}</h2>
              <p className={styles.cardText}>{FEATURE.text}</p>
            </div>
          </a>

          <a href={SIDE.href} className={`${styles.card} ${styles.cardSide}`}>
            <div className={styles.sideMedia}>
              <video
                ref={videoRef}
                className={styles.cardVideo}
                src={SIDE.video}
                poster={SIDE.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
              />
              <span className={styles.badge} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </span>
            </div>
            <p className={styles.sideText}>{SIDE.text}</p>
          </a>
        </div>
      </div>
    </section>
  );
}

export default DonationView;