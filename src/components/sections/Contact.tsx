import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { personal } from '../../data'

// ── EmailJS configuration ──────────────────────────────────────
// Service ID  : create a free account at emailjs.com → Email Services
// Template ID : create a template with variables: {{from_name}}, {{from_email}}, {{message}}
// Public Key  : Settings → API Keys → Public Key
// The template should send TO: siddharthsanjaybade212223@gmail.com
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
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    // Send with every common variable name variant — template will pick what it uses
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
      <section id="contact" className="section contact-section">
        <div className="section-content">
          <div className="section-tag">05 // GET IN TOUCH</div>
          <h2 className="section-title">
            START A <span className="blood-text">CONVERSATION</span>
          </h2>

          <div className="contact-grid">
            {/* ── Left Column: Contact Meta & Resume Card ── */}
            <div className="contact-info">
              <p className="contact-lead">
                Have an exciting idea, an ambitious project, or an engineering role? Let's build something remarkable together.
              </p>

              <div className="contact-meta-item">
                <i className="fa-regular fa-envelope" />
                <a href={`mailto:${personal.email}`} className="contact-meta-link">
                  {personal.email}
                </a>
              </div>

              <div className="contact-meta-item">
                <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }} />
                <a
                  href={personal.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-meta-link"
                >
                  {personal.phone} (WhatsApp Direct)
                </a>
              </div>

              <div className="contact-meta-item">
                <i className="fa-solid fa-location-dot" />
                <span>
                  {personal.location} &bull; Open for Remote &amp; Relocation
                </span>
              </div>

              {/* Verified Social Handles */}
              <div className="contact-social-group">
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
              <div className="resume-showcase-card glass-card">
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

            {/* ── Right Column: Message Form ── */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form glass-card"
              id="contactForm"
            >
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
                <label htmlFor="contactMsg">MESSAGE</label>
                <textarea
                  id="contactMsg"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project, timeline, or engineering role..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

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
                <p className="text-center text-xs font-bold text-emerald-400 tracking-wider mt-3">
                  ✓ Message sent! I'll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-center text-xs font-bold text-red-400 tracking-wider mt-3">
                  ✗ Something went wrong. Please email me directly at{' '}
                  <a href={`mailto:${personal.email}`} className="underline">
                    {personal.email}
                  </a>
                </p>
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
