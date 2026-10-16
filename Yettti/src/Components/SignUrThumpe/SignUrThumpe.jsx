import React, { useState, useEffect, useRef } from "react";
import styles from "./SignUrThumpe.module.css";

// Change these two to any images you like.
import cardImg from "../../assets/Yetttimg/yettifuul.jpg";
import modalImg from "../../assets/Yetttimg/yetti1.jpg";

const BRAND = "YettiJourney";
const AMOUNTS = [5, 10, 25, 50];

function SignUrThumpe() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(""); // "" = no donation
  const [error, setError] = useState("");
  const closeRef = useRef(null);

  // Lock page scroll, close on Escape, and focus the close button while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeModal = () => {
    setOpen(false);
    // reset after the overlay is gone
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setMessage("");
      setAmount("");
      setError("");
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");

    // TODO: send this to your backend / email service
    console.log({ email, message, donation: amount ? Number(amount) : 0 });

    setSubmitted(true);
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.copy}>
          <h2 className={styles.title}>Want good news in your inbox?</h2>
          <p className={styles.text}>
            Become a Yetti Insider today to receive our newsletter and learn
            about the incredible progress we are making, our stories, and more.
          </p>
          <button
            type="button"
            className={styles.cta}
            onClick={() => setOpen(true)}
          >
            Sign up to Support the Journey
          </button>
        </div>
        <div className={styles.photo}>
          <img src={cardImg} alt="" />
        </div>
      </div>

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-title"
        >
          <div className={styles.overlayPhoto}>
            <img src={modalImg} alt="" />
          </div>

          <div className={styles.panel}>
            <button
              type="button"
              className={styles.close}
              onClick={closeModal}
              ref={closeRef}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>

            <p className={styles.brand}>{BRAND}</p>

            <div className={styles.body}>
              {submitted ? (
                <div className={styles.thanks}>
                  <h3 className={styles.formTitle} id="signup-title">
                    Thanks for signing up!
                  </h3>
                  <p className={styles.hint}>
                    We sent a confirmation to <strong>{email}</strong>.
                    {amount
                      ? ` Thank you for your $${amount} donation too.`
                      : ""}
                  </p>
                  <button
                    type="button"
                    className={styles.submit}
                    onClick={closeModal}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className={styles.formTitle} id="signup-title">
                    Join the Yetti's  Life Journey
                  </h3>

                  <label className={styles.label} htmlFor="su-email">
                    Email address
                  </label>
                  <input
                    id="su-email"
                    type="email"
                    className={styles.input}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? "su-error" : undefined}
                    required
                  />
                  {error && (
                    <p className={styles.error} id="su-error">
                      {error}
                    </p>
                  )}

                  <label className={styles.label} htmlFor="su-message">
                    Anything you want to give us feedback about?{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    id="su-message"
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder="Tell us what topics you care about"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <fieldset className={styles.fieldset}>
                    <legend className={styles.label}>
                      Add a donation{" "}
                      <span className={styles.optional}>(optional)</span>
                    </legend>
                    <div className={styles.amounts}>
                      {AMOUNTS.map((a) => (
                        <button
                          type="button"
                          key={a}
                          className={`${styles.chip} ${
                            String(a) === String(amount) ? styles.chipOn : ""
                          }`}
                          aria-pressed={String(a) === String(amount)}
                          onClick={() =>
                            setAmount(String(a) === String(amount) ? "" : String(a))
                          }
                        >
                          ${a}
                        </button>
                      ))}
                      <input
                        type="number"
                        min="1"
                        inputMode="numeric"
                        className={`${styles.input} ${styles.custom}`}
                        placeholder="Other"
                        aria-label="Custom donation amount in dollars"
                        value={AMOUNTS.map(String).includes(String(amount)) ? "" : amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </fieldset>

                  <button type="submit" className={styles.submit}>
                    Sign up
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SignUrThumpe;