import React, { useEffect, useState } from "react";
import styles from "./Family.module.css";

// Images come from src/assets/Yetttimg (folder name exactly as in your project).
import imgThumb from "../../assets/Yetttimg/yettiSkitch1.jpg";
import slide1 from "../../assets/Yetttimg/yetti1.jpg";
import slide2 from "../../assets/Yetttimg/yetti2jpg.jpg";
import slide3 from "../../assets/Yetttimg/yettifuul.jpg";
import slide4 from "../../assets/Yetttimg/yettiSkitch3.jpg";

/*
  The big video is a YouTube video. Only the video ID is needed:
  from  https://youtu.be/8Z1gMwxRXMo?si=...  the ID is  8Z1gMwxRXMo
  (A normal YouTube link can't go inside a <video> tag, so it is embedded instead.)
*/
const YOUTUBE_ID = "8Z1gMwxRXMo";
const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";

// Cover picture shown until the user clicks play (YouTube's own thumbnail).
// The first one is the sharp version; the second is the fallback if it doesn't exist.
const THUMBNAILS = [
  `https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`,
];

// Used only after the user clicks play, so it starts with sound
const EMBED_SRC =
  `${YOUTUBE_ORIGIN}/embed/${YOUTUBE_ID}` +
  "?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3";

const SIDE_TEXT = {
  eyebrow: "Together",
  title: "Remembering the ones who raised us",
  text: "We will miss them every day.",
  href: "/family",
};

/*
  The small slider. Each image stays on screen for its own number of seconds.
  Change `seconds` per image, or add / remove images.
*/
const SLIDES = [
  { src: slide1, alt: "Family sketch one", seconds: 3 },
  { src: slide2, alt: "Family sketch two", seconds: 5 },
  { src: slide3, alt: "Family sketch three", seconds: 4 },
  { src: slide4, alt: "Family sketch four", seconds: 6 },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
  </svg>
);

function Family() {
  /* ---------- Big YouTube video (plays only after a click) ---------- */
  const [videoStarted, setVideoStarted] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);

  const showNextThumbnail = () =>
    setThumbIndex((i) => Math.min(i + 1, THUMBNAILS.length - 1));

  // YouTube answers with a tiny grey placeholder when the sharp thumbnail is missing
  const handleThumbLoad = (e) => {
    if (e.currentTarget.naturalWidth <= 120) showNextThumbnail();
  };

  /* ---------- Small slider ---------- */
  const [index, setIndex] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(prefersReducedMotion);
  const [hovering, setHovering] = useState(false);

  // Each slide waits its own number of seconds, then moves on.
  useEffect(() => {
    if (sliderPaused || hovering) return undefined;
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDES[index].seconds * 1000
    );
    return () => clearTimeout(timer);
  }, [index, sliderPaused, hovering]);

  return (
    <section className={styles.section} aria-labelledby="family-intro">
      <div className={styles.inner}>
        {/* ---------- Intro paragraph ---------- */}
        <p id="family-intro" className={styles.intro}>
          <span>We&rsquo;re grateful for our </span>
          <a href="/friends" className={styles.inlineLink}>
            <strong>family and friends</strong>
            <img
              className={styles.thumb}
              src={imgThumb}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </a>
          <span>
            . They remind us of what&rsquo;s important, and they inspire us to give more.
          </span>
        </p>

        <div className={styles.layout}>
          {/* ---------- Big video card (click to play) ---------- */}
          <div className={styles.videoCard}>
            {videoStarted ? (
              <iframe
                className={styles.embed}
                src={EMBED_SRC}
                title="Family video"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button
                type="button"
                className={styles.posterButton}
                onClick={() => setVideoStarted(true)}
                aria-label="Play family video"
              >
                <img
                  className={styles.posterImg}
                  src={THUMBNAILS[thumbIndex]}
                  alt=""
                  onLoad={handleThumbLoad}
                  onError={showNextThumbnail}
                  draggable="false"
                />
                <span className={styles.playBig} aria-hidden="true">
                  <PlayIcon />
                </span>
              </button>
            )}
          </div>

          {/* ---------- Right column ---------- */}
          <aside className={styles.side}>
            <div className={styles.sideInfo}>
              <span className={styles.eyebrow}>{SIDE_TEXT.eyebrow}</span>
              <h3 className={styles.sideTitle}>
                <a href={SIDE_TEXT.href}>{SIDE_TEXT.title}</a>
              </h3>
              <p className={styles.sideText}>{SIDE_TEXT.text}</p>
            </div>

            {/* Horizontal image slider */}
            <div
              className={styles.slider}
              role="region"
              aria-roledescription="carousel"
              aria-label="Family photos"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onFocus={() => setHovering(true)}
              onBlur={() => setHovering(false)}
            >
              <div
                className={styles.track}
                style={{ transform: `translateX(-${index * 100}%)` }}
                aria-live={sliderPaused || hovering ? "polite" : "off"}
              >
                {SLIDES.map((slide, i) => (
                  <div
                    key={slide.src}
                    className={styles.slide}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${SLIDES.length}`}
                    aria-hidden={i !== index}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`${styles.badge} ${styles.badgeOrange}`}
                onClick={() => setSliderPaused((p) => !p)}
                aria-label={sliderPaused ? "Play slideshow" : "Pause slideshow"}
              >
                {sliderPaused ? <PlayIcon /> : <PauseIcon />}
              </button>

              <div className={styles.dots}>
                {SLIDES.map((slide, i) => (
                  <button
                    key={slide.src}
                    type="button"
                    className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Family;