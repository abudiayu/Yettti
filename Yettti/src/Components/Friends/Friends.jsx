import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Friends.module.css";

// FIX: Use a URL string instead of importing an image from HTTPS.
const imgPoster =
  "https://encrypted-tbn0.gstatic.com/images?q=ANd9GcTJdNrEhxONSeo6GS4viIisLG6RHRa39MLkZS5RAl2AGpPZ4nKnRNLRbIVW&s=10";

// Images from src/assets/Yetttimg
import img1 from "../../assets/Yetttimg/yetti1.jpg";
import img2 from "../../assets/Yetttimg/yetti2jpg.jpg";
import img3 from "../../assets/Yetttimg/yettifuul.jpg";
import img4 from "../../assets/Yetttimg/yettiSkitch3.jpg";
import img5 from "../../assets/Yetttimg/yettiSkitch1.jpg";

const HEADING = "Our friends";

const YOUTUBE_ID = "axU4fPAaM6k";
const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";

const EMBED_SRC =
  `${YOUTUBE_ORIGIN}/embed/${YOUTUBE_ID}` +
  "?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3";

const FEATURE = {
  poster: imgPoster,
  caption:
    "We’ve had a lot of good fortune — but few things make us as lucky as the friends who walk beside us.",
};

const ITEMS = [
  {
    eyebrow: "\u2026and many more",
    title: "Celebrating a milestone together",
    text: "It\u2019s hard to believe how far we have come.",
    image: img1,
    alt: "Friends celebrating together",
    href: "/friends/milestone",
  },
  {
    eyebrow: "Side by side",
    title: "Working and laughing with our friends",
    text: "Learn what a good team and a good laugh have in common.",
    image: img2,
    alt: "Friends working together",
    href: "/friends/together",
  },
  {
    eyebrow: "Sweet moments",
    title: "Stories from the road",
    text: "And what we learned along the way.",
    image: img3,
    alt: "Friends on the road",
    href: "/friends/stories",
  },
  {
    eyebrow: "From the sketchbook",
    title: "Faces behind the sketches",
    text: "Meet the people who inspired every drawing.",
    image: img4,
    alt: "Sketch of a friend",
    href: "/friends/sketches",
  },
  {
    eyebrow: "Always welcome",
    title: "Come and sit at our table",
    text: "There is always room for one more friend.",
    image: img5,
    alt: "Friends at the table",
    href: "/friends/table",
  },
];

const TOTAL = ITEMS.length + 1;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

const Chevron = ({ direction }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path
      d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Friends() {
  const [videoStarted, setVideoStarted] = useState(false);

  const scrollerRef = useRef(null);
  const frameRef = useRef(0);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [current, setCurrent] = useState(1);

  // Calculate one card width plus the gap.
  const getStep = useCallback(() => {
    const scroller = scrollerRef.current;
    const first = scroller?.firstElementChild;

    if (!scroller || !first) return 0;

    const computedStyle = window.getComputedStyle(scroller);
    const gap =
      parseFloat(computedStyle.columnGap) ||
      parseFloat(computedStyle.gap) ||
      0;

    return first.getBoundingClientRect().width + gap;
  }, []);

  // Update carousel controls and counter.
  const update = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = Math.max(
      0,
      scroller.scrollWidth - scroller.clientWidth
    );

    const atStart = scroller.scrollLeft <= 2;
    const atEnd = scroller.scrollLeft >= maxScroll - 2;
    const step = getStep() || 1;

    setCanPrev(!atStart);
    setCanNext(!atEnd);

    setCurrent(
      atEnd
        ? TOTAL
        : Math.min(
            TOTAL,
            Math.max(1, Math.round(scroller.scrollLeft / step) + 1)
          )
    );
  }, [getStep]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };

    update();

    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frameRef.current);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const step = getStep();
    if (!step) return;

    scroller.scrollBy({
      left: direction * step,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section className={styles.section} aria-labelledby="friends-heading">
      <div className={styles.inner}>
        <h2 id="friends-heading" className={styles.heading}>
          {HEADING}
        </h2>

        <div
          className={styles.carousel}
          role="region"
          aria-roledescription="carousel"
          aria-label={HEADING}
        >
          <ul className={styles.track} ref={scrollerRef} tabIndex={0}>
            {/* Featured YouTube video */}
            <li className={`${styles.slide} ${styles.featureSlide}`}>
              <div className={styles.featureCard}>
                <div className={styles.featureMedia}>
                  {videoStarted ? (
                    <iframe
                      className={styles.embed}
                      src={EMBED_SRC}
                      title="Friends video"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <>
                      <img
                        className={styles.posterImg}
                        src={FEATURE.poster}
                        alt="Friends video poster"
                        draggable="false"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />

                      <button
                        type="button"
                        className={styles.mediaHit}
                        onClick={() => setVideoStarted(true)}
                        aria-label="Play friends video"
                      />

                      <span className={styles.badge} aria-hidden="true">
                        <PlayIcon />
                      </span>
                    </>
                  )}
                </div>

                <p className={styles.featureCaption}>
                  {FEATURE.caption}
                </p>
              </div>
            </li>

            {/* Friends image cards */}
            {ITEMS.map((item) => (
              <li key={item.href} className={styles.slide}>
                <article className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.eyebrow}>
                      {item.eyebrow}
                    </span>

                    <h3 className={styles.itemTitle}>
                      <a href={item.href}>{item.title}</a>
                    </h3>

                    <p className={styles.itemText}>{item.text}</p>
                  </div>

                  <a
                    href={item.href}
                    className={styles.itemImageLink}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      className={styles.itemImage}
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  </a>
                </article>
              </li>
            ))}
          </ul>

          {/* Carousel controls */}
          <div className={styles.controls}>
            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous"
              >
                <Chevron direction="left" />
              </button>

              <button
                type="button"
                className={styles.arrow}
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next"
              >
                <Chevron direction="right" />
              </button>
            </div>

            <span className={styles.counter} aria-live="polite">
              {current} / {TOTAL}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Friends;