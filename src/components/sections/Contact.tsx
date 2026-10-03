import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personal } from '../../data'

gsap.registerPlugin(ScrollTrigger)

// ── EmailJS configuration ──────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_a53pg4g'
const EMAILJS_TEMPLATE_ID = 'template_ll4dyn4'
const EMAILJS_PUBLIC_KEY = 'jzkNH0eAazLbG1Sw3'

// Initialise once so every send() call is authenticated
emailjs.init(EMAILJS_PUBLIC_KEY)

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

interface ContactProps {
  onOpenResume?: () => void
}

export default function Contact({ onOpenResume }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [gotcha, setGotcha] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [lastSubmit, setLastSubmit] = useState(0)
  const [cooldownMsg, setCooldownMsg] = useState('')

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.contact-header-anim', {
        x: -25,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-header-anim',
          start: 'top 85%',
        },
      })

      gsap.from('.contact-meta-anim', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-info',
          start: 'top 85%',
        },
      })

      gsap.from('.contact-form-anim', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 85%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    // 1. Anti-spam Honeypot Trap: If hidden bot field is populated, simulate success
    if (gotcha.trim().length > 0) {
      console.warn('Bot submission trapped via honeypot field.')
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
      return
    }

    // 2. Client-side Rate-limiting Cooldown (30 seconds)
    const now = Date.now()
    if (now - lastSubmit < 30000) {
      const waitSec = Math.ceil((30000 - (now - lastSubmit)) / 1000)
      setCooldownMsg(`Rate limit: Please wait ${waitSec}s before sending another message.`)
      setTimeout(() => setCooldownMsg(''), 4000)
      return
    }

    setStatus('sending')
    setCooldownMsg('')

    const params = {
      from_name: formData.name,
      user_name: formData.name,
      name: formData.name,
      from_email: formData.email,
      user_email: formData.email,
      reply_to: formData.email,
      email: formData.email,
      message: formData.message,
      message_html: formData.message,
    }

    try {
      const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      console.log('EmailJS success:', res.status, res.text)
      setLastSubmit(Date.now())
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err: unknown) {
      const ejsErr = err as { status?: number; text?: string }
      console.error('EmailJS error — status:', ejsErr?.status, '| text:', ejsErr?.text, '| raw:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const openResume = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onOpenResume) {
      onOpenResume()
    } else {
      window.dispatchEvent(new CustomEvent('open-resume'))
    }
  }

  return (
    <>
      <section ref={sectionRef} id="contact" className="section contact-section">
        <div className="section-content">
          <div className="contact-header-anim">
            <div className="section-tag">07 // GET IN TOUCH</div>
            <h2 className="section-title">
              START A <span className="blood-text">CONVERSATION</span>
            </h2>
          </div>

          <div className="contact-grid">
            {/* ── Left Column: Contact Meta & Resume Card ── */}
            <div className="contact-info">
              <p className="contact-lead contact-meta-anim">
                Have an exciting idea, an ambitious project, or an engineering role? Let's build something remarkable together.
              </p>

              <div className="contact-meta-item contact-meta-anim">
                <i className="fa-regular fa-envelope" />
                <a href={`mailto:${personal.email}`} className="contact-meta-link">
                  {personal.email}
                </a>
              </div>

              <div className="contact-meta-item contact-meta-anim">
                <i className="fa-solid fa-phone" />
                <a href={personal.telLink} className="contact-meta-link">
                  {personal.phone}
                </a>
              </div>

              <div className="contact-meta-item contact-meta-anim">
                <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }} />
                <a
                  href={personal.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-meta-link"
                >
                  WhatsApp Direct
                </a>
              </div>

              <div className="contact-meta-item contact-meta-anim">
                <i className="fa-solid fa-location-dot" />
                <span>
                  {personal.location} &bull; Open for Remote &amp; Relocation
                </span>
              </div>

              {/* Verified Social Handles */}
              <div className="contact-social-group contact-meta-anim">
                <span className="social-group-label">CONNECT ACROSS PLATFORMS:</span>
                <div className="contact-socials">
                  <a
                    href={personal.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    title="Chat on WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp" />
                  </a>
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn Profile"
                  >
                    <i className="fa-brands fa-linkedin-in" />
                  </a>
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    title="GitHub Profile"
                  >
                    <i className="fa-brands fa-github" />
                  </a>
                  <a
                    href={personal.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram Profile"
                  >
                    <i className="fa-brands fa-instagram" />
                  </a>
                  <a
                    href={personal.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                    title="Twitter Profile"
                  >
                    <i className="fa-brands fa-x-twitter" />
                  </a>
                  <a
                    href={`mailto:${personal.email}`}
                    aria-label="Email"
                    title="Direct Email"
                  >
                    <i className="fa-solid fa-envelope" />
                  </a>
                </div>
              </div>

              {/* Interactive Resume Showcase Card */}
              <div className="resume-showcase-card glass-card contact-meta-anim">
                <div className="resume-card-header">
                  <div className="resume-icon-badge">
                    <i className="fa-solid fa-file-pdf" />
                  </div>
                  <div className="resume-text-meta">
                    <span className="resume-meta-tag">CURRICULUM VITAE</span>
                    <h4 className="resume-meta-title">Siddharth Bade &mdash; Resume</h4>
                    <p className="resume-meta-desc">
                      ATS-friendly, print-ready document covering full-stack AI skills, technical projects (NexStep &amp; JARVIS), and academic background.
                    </p>
                  </div>
                </div>
                <div className="resume-card-actions">
                  <a
                    href={personal.resumeUrl}
                    onClick={openResume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-blood w-full text-center"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs mr-2" />
                    <span>VIEW &amp; PRINT RESUME</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Right Column: Message Form with Honeypot & Rate-Limiting ── */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form glass-card contact-form-anim"
              id="contactForm"
            >
              {/* Invisible Bot Honeypot Field */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }}
                value={gotcha}
                onChange={(e) => setGotcha(e.target.value)}
              />

              <div className="form-group">
                <label htmlFor="contactName">YOUR NAME</label>
                <input
                  type="text"
                  id="contactName"
                  name="from_name"
                  placeholder="e.g. Alex Sharma"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">YOUR EMAIL</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="from_email"
                  placeholder="alex@company.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="contactMsg" className="m-0">MESSAGE</label>
                  <span className={`text-[11px] font-mono ${formData.message.length > 950 ? 'text-[var(--blood-neon)] font-bold' : 'text-[var(--text-silver)]'}`}>
                    {formData.message.length} / 1000
                  </span>
                </div>
                <textarea
                  id="contactMsg"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell me about your project, timeline, or engineering role..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {cooldownMsg && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-clock text-xs" />
                  <span>{cooldownMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-blood w-full"
                disabled={status === 'sending'}
                style={{ opacity: status === 'sending' ? 0.7 : 1 }}
              >
                {status === 'sending' ? (
                  <>
                    <span>SENDING...</span>
                    <i className="fa-solid fa-spinner fa-spin text-xs" />
                  </>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <i className="fa-solid fa-paper-plane text-xs" />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="form-status-msg form-status-success">
                  <i className="fa-solid fa-circle-check" />
                  <span>Message sent! I'll get back to you within 24 hours.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="form-status-msg form-status-error">
                  <i className="fa-solid fa-circle-exclamation" />
                  <span>
                    Something went wrong. Email me directly at{' '}
                    <a href={`mailto:${personal.email}`} className="underline">
                      {personal.email}
                    </a>
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand-side">
            <span className="footer-brand-name">SIDDHARTH BADE</span>
            <span className="footer-brand-sub">AI &amp; DATA SCIENCE ENGINEER</span>
            <span className="footer-copy">
              &copy; {new Date().getFullYear()} Siddharth Bade. All rights reserved.
            </span>
          </div>

          {/* Central Social Dock */}
          <div className="footer-social-dock">
            <a
              href={personal.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="footer-social-btn"
              title="Chat on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp" />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer-social-btn"
              title="LinkedIn Profile"
            >
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer-social-btn"
              title="GitHub Profile"
            >
              <i className="fa-brands fa-github" />
            </a>
            <a
              href={personal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-social-btn"
              title="Instagram Profile"
            >
              <i className="fa-brands fa-instagram" />
            </a>
            <a
              href={personal.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="footer-social-btn"
              title="Twitter Profile"
            >
              <i className="fa-brands fa-x-twitter" />
            </a>
            <a
              href={`mailto:${personal.email}`}
              className="footer-social-btn"
              title="Direct Email"
            >
              <i className="fa-solid fa-envelope" />
            </a>
            <a
              href={personal.resumeUrl}
              onClick={openResume}
              className="footer-social-btn"
              title="Open Resume"
            >
              <i className="fa-solid fa-file-lines" />
            </a>
          </div>

          <div className="footer-right-side">
            <a
              href={personal.resumeUrl}
              onClick={openResume}
              className="footer-resume-pill"
            >
              <i className="fa-solid fa-file-lines text-xs" />
              <span>VIEW RESUME</span>
            </a>
            <span className="footer-badge">CRAFTED WITH PRECISION &amp; THREE.JS</span>
          </div>
        </div>
      </footer>
    </>
  )
}
