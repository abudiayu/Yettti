import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Style from './Auth.module.css';
import heroImg from '../../assets/Yetttimg/yettiSkitche2.jpg';

function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: replace with your real sign-in request
    console.log('Sign in:', { email, password, remember })
    navigate('/admin')
  }

  return (
    <main className={Style.page}>
      {/* Left: photo with wavy edge */}
      <section className={Style.visual} aria-hidden="true">
        <img
          src={heroImg}
          alt=""
          className={Style.photo}
          draggable="false"
        />
        <div className={Style.tint} />

        <svg
          className={Style.wave}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className={Style.wavePath}
            d="M58 0 C58 18 14 24 20 46 C26 68 70 72 44 100 L100 100 L100 0 Z"
          />
        </svg>
      </section>

      {/* Right: form */}
      <section className={Style.formSide}>
        <div className={Style.formWrap}>
          <h1 className={Style.title}>Welcome back!</h1>
          <p className={Style.subtitle}>Sign in to continue to your account</p>

          <form className={Style.form} onSubmit={handleSubmit}>
            {/* Email */}
            <div className={Style.field}>
              <label htmlFor="auth-email" className={Style.label}>
                Email address
              </label>
              <div className={Style.inputWrap}>
                <span className={Style.iconLeft} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <input
                  id="auth-email"
                  type="email"
                  className={Style.input}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={Style.field}>
              <label htmlFor="auth-password" className={Style.label}>
                Password
              </label>
              <div className={Style.inputWrap}>
                <span className={Style.iconLeft} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${Style.input} ${Style.passwordInput}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={Style.eye}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={Style.row}>
              <label className={Style.check}>
                <input
                  type="checkbox"
                  className={Style.checkInput}
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className={Style.link}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className={Style.submit}>
              Sign in
            </button>

            <p className={Style.signup}>
              <Link to="/" className={Style.link}>
                Back to site.
              </Link>{' '}
              instead.
            </p>

            <p className={Style.terms}>
              By continuing, you agree to our{' '}
              <Link to="/terms" className={Style.link}>
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className={Style.link}>
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Auth