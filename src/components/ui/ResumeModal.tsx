import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { personal, projects } from '../../data'

// Configure PDF.js worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

function PdfCanvasViewer({
  pdfUrl,
  onSwitchToAts,
}: {
  pdfUrl: string
  onSwitchToAts: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1.35)

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    const render = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
        const pdf = await loadingTask.promise
        if (isCancelled) return

        const page = await pdf.getPage(1)
        if (isCancelled) return

        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return

        const viewport = page.getViewport({ scale })
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise

        if (!isCancelled) {
          setLoading(false)
        }
      } catch (err) {
        console.error('PDF.js render error:', err)
        if (!isCancelled) {
          setError('Unable to parse PDF on this device')
          setLoading(false)
        }
      }
    }

    render()

    return () => {
      isCancelled = true
    }
  }, [pdfUrl, scale])

  return (
    <div className="w-full flex flex-col items-center">
      {/* Control bar */}
      <div className="flex items-center gap-3 mb-4 p-1.5 px-4 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white shadow-lg">
        <button
          type="button"
          onClick={() => setScale((s) => Math.max(0.75, s - 0.15))}
          className="hover:text-[var(--blood-neon)] transition-colors p-1"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <i className="fa-solid fa-magnifying-glass-minus" />
        </button>
        <span className="font-mono text-[11px] text-[var(--text-silver)] font-bold min-w-[38px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setScale((s) => Math.min(2.2, s + 0.15))}
          className="hover:text-[var(--blood-neon)] transition-colors p-1"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <i className="fa-solid fa-magnifying-glass-plus" />
        </button>
        <span className="text-white/20">|</span>
        <button
          type="button"
          onClick={onSwitchToAts}
          className="hover:text-[var(--blood-neon)] transition-colors flex items-center gap-1.5 text-xs text-[var(--text-silver)] hover:text-white"
        >
          <i className="fa-solid fa-align-left text-xs" />
          <span>Interactive ATS</span>
        </button>
        <span className="text-white/20">|</span>
        <a
          href={pdfUrl}
          download="Siddharth_Bade_Resume.pdf"
          className="hover:text-[var(--blood-neon)] transition-colors flex items-center gap-1.5 text-xs font-semibold text-[var(--blood-neon)]"
        >
          <i className="fa-solid fa-download text-xs" />
          <span>Save PDF</span>
        </a>
      </div>

      {loading && (
        <div className="py-24 flex flex-col items-center gap-3 text-white">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-[var(--blood-neon)]" />
          <span className="text-xs text-[var(--text-silver)] font-mono tracking-wider">
            Rendering high-fidelity vector PDF...
          </span>
        </div>
      )}

      {error ? (
        <div className="py-16 flex flex-col items-center gap-3 text-white text-center p-6 bg-[#120410] rounded-2xl border border-white/10 max-w-md">
          <i className="fa-solid fa-triangle-exclamation text-3xl text-amber-400 mb-1" />
          <p className="text-sm font-semibold">{error}</p>
          <p className="text-xs text-[var(--text-silver)]">
            You can view the full Interactive ATS format or download the official PDF.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={onSwitchToAts}
              className="btn btn-blood"
            >
              Interactive ATS View
            </button>
            <a
              href={pdfUrl}
              download="Siddharth_Bade_Resume.pdf"
              className="btn btn-glass"
            >
              Download PDF
            </a>
          </div>
        </div>
      ) : (
        <div
          className={`overflow-auto max-w-full rounded-xl shadow-2xl border border-[rgba(255,0,60,0.3)] bg-white ${
            loading ? 'hidden' : 'block'
          }`}
        >
          <canvas ref={canvasRef} className="block max-w-full h-auto" />
        </div>
      )}

      <p className="text-[11px] text-[var(--text-muted)] mt-3">
        Rendered with HTML5 Canvas. Crisp vector typography with zoom controls.
      </p>
    </div>
  )
}

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * In-Website Resume Modal Viewer:
 * - Shows resume directly inside the website without redirecting away
 * - Tab 1: Embedded native PDF Viewer displaying the exact attached resume.pdf
 * - Tab 2: High-fidelity Interactive ATS Format view
 * - Quick Action Buttons: Download PDF, Print, Full-screen close
 */
export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'ats'>('pdf')

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100001] flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Siddharth Bade Resume Viewer"
    >
      {/* Dark frosted backdrop */}
      <div
        className="absolute inset-0 bg-[#040106]/92 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[94vh] bg-[#0c030a] border border-[rgba(255,0,60,0.4)] rounded-2xl md:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,0,60,0.25)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ── Modal Header Bar ── */}
        <div className="px-5 py-4 border-b border-[rgba(255,0,60,0.2)] bg-[#120410]/95 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(255,0,60,0.15)] border border-[var(--blood-neon)] flex items-center justify-center text-[var(--blood-neon)] text-lg shadow-[0_0_15px_var(--blood-glow)]">
              <i className="fa-solid fa-file-pdf" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Outfit'] font-extrabold text-base md:text-lg text-white">
                  SIDDHARTH SANJAY BADE
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold font-['Space_Grotesk'] text-[var(--blood-neon)] bg-[rgba(255,0,60,0.12)] border border-[rgba(255,0,60,0.3)]">
                  VERIFIED RESUME
                </span>
              </div>
              <p className="text-xs text-[var(--text-silver)]">
                AI &amp; Data Science Engineer &bull; Adsul's Technical Campus
              </p>
            </div>
          </div>

          {/* Controls: Tabs, Download, Close */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Tab switchers */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold font-['Space_Grotesk']">
              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-[var(--blood-neon)] text-white shadow-md'
                    : 'text-[var(--text-silver)] hover:text-white'
                }`}
              >
                <i className="fa-solid fa-file-pdf mr-1.5 text-xs" />
                <span>PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ats')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'ats'
                    ? 'bg-[var(--blood-neon)] text-white shadow-md'
                    : 'text-[var(--text-silver)] hover:text-white'
                }`}
              >
                <i className="fa-solid fa-align-left mr-1.5 text-xs" />
                <span>Interactive ATS</span>
              </button>
            </div>

            {/* Direct Download Button */}
            <a
              href="/resume.pdf"
              download="Siddharth_Bade_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white text-xs font-semibold font-['Space_Grotesk'] transition-all"
              title="Download PDF to device"
            >
              <i className="fa-solid fa-download text-xs" />
              <span className="hidden md:inline">Download</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[rgba(255,0,60,0.12)] border border-[rgba(255,0,60,0.35)] text-white hover:bg-[var(--blood-neon)] hover:border-white transition-all flex items-center justify-center text-sm cursor-pointer shadow-md"
              aria-label="Close resume viewer"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        {/* ── Modal Content Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080208]">
          {activeTab === 'pdf' ? (
            /* Tab 1: High-Fidelity Canvas Vector PDF Viewer (Bypasses all browser plugin blocks) */
            <div className="w-full flex flex-col items-center">
              <PdfCanvasViewer
                pdfUrl="/resume.pdf"
                onSwitchToAts={() => setActiveTab('ats')}
              />
            </div>
          ) : (
            /* Tab 2: High-Fidelity Interactive ATS Resume Format */
            <div className="max-w-3xl mx-auto bg-[#ffffff] text-[#111827] rounded-xl p-8 sm:p-12 shadow-2xl font-sans text-left leading-normal selection:bg-[#ff003c] selection:text-white">
              {/* ATS Header */}
              <div className="text-center pb-6 border-b border-gray-300">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                  SIDDHARTH SANJAY BADE
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Ahilyanagar, Maharashtra, India &bull; {personal.phone} &bull;{' '}
                  <a href={`mailto:${personal.email}`} className="text-blue-600 hover:underline">
                    {personal.email}
                  </a>
                </p>
                <div className="flex justify-center items-center gap-3 text-xs sm:text-sm text-blue-600 mt-1.5 flex-wrap">
                  <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    LinkedIn Profile
                  </a>
                  <span>&bull;</span>
                  <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    GitHub Profile
                  </a>
                  <span>&bull;</span>
                  <a href={personal.nexstepLive} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-red-600">
                    NexStep Live Demo
                  </a>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                  {personal.summary}
                </p>
              </div>

              {/* Technical Skills */}
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5">
                  TECHNICAL SKILLS
                </h2>
                <div className="space-y-1 text-xs sm:text-sm text-gray-800">
                  <p><strong>Languages:</strong> Python, Java, C++, JavaScript</p>
                  <p><strong>Frameworks &amp; Libraries:</strong> FastAPI, React.js, Tailwind CSS, Flutter, sentence-transformers</p>
                  <p><strong>APIs &amp; Data:</strong> REST API design &amp; integration, OpenAI API, Judge0 API, SQLite</p>
                  <p><strong>Core CS:</strong> Data Structures &amp; Algorithms, Object-Oriented Programming (OOP), Operating Systems</p>
                  <p><strong>Tools:</strong> Git, GitHub, Vercel, Python Virtual Environments</p>
                </div>
              </div>

              {/* Projects */}
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-900 pb-0.5">
                  PROJECTS
                </h2>

                <div className="space-y-5">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                          {proj.title}
                        </h3>
                        <span className="text-[11px] text-gray-600 italic">
                          {proj.tags.join(', ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        {proj.role} &bull;{' '}
                        <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                        {proj.liveUrl && (
                          <>
                            {' '}&bull;{' '}
                            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-bold">
                              Live Demo
                            </a>
                          </>
                        )}
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
                        {proj.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b-2 border-gray-900 pb-0.5">
                  EDUCATION
                </h2>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline text-xs sm:text-sm">
                      <strong className="text-gray-900">Adsul's Technical Campus, Ahilyanagar</strong>
                      <span className="text-gray-600">2024 &ndash; Present</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      B.Tech in Artificial Intelligence and Data Science | Third Year, Semester V
                    </p>
                    <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-700 mt-1">
                      <li><strong>First-Year SGPA: 8.47 / 10</strong> (Rank 1 in the combined first-year batch)</li>
                      <li>Coursework: Data Structures &amp; Algorithms, Object-Oriented Programming, Operating Systems, Web Technologies, Digital Logic Design</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline text-xs sm:text-sm">
                      <strong className="text-gray-900">Pemraj Sarda College, Ahilyanagar</strong>
                      <span className="text-gray-600">2024</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Higher Secondary Certificate (12th HSC) &bull; Science Stream (Maths, Physics, CS)
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline text-xs sm:text-sm">
                      <strong className="text-gray-900">Dr. J. Paulbudhe M. V., Ahilyanagar</strong>
                      <span className="text-gray-600">2022</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      Secondary School Certificate (10th SSC) | <strong>Score: 88% Distinction</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Virtual Experience */}
              <div className="py-4 border-b border-gray-200">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5">
                  VIRTUAL EXPERIENCE
                </h2>
                <div className="flex justify-between items-baseline text-xs sm:text-sm">
                  <strong className="text-gray-900">Tata GenAI Powered Data Analytics Job Simulation</strong>
                  <span className="text-gray-600">Tata iQ via Forage 2026</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mt-1">
                  Completed a virtual job simulation applying GenAI to real-world data analytics scenarios.
                </p>
              </div>

              {/* Leadership & Achievements */}
              <div className="pt-4">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-900 mb-2 border-b-2 border-gray-900 pb-0.5">
                  LEADERSHIP &amp; ACHIEVEMENTS
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>
                    <strong>Branch Treasurer, AI &amp; Data Science:</strong> Manage branch-level finances and coordinate with the department.
                  </li>
                  <li>
                    <strong>Academic Excellence:</strong> Awarded an official certificate and trophy for ranking 1st across the combined first-year engineering batch.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[rgba(255,0,60,0.18)] bg-[#0d030c] flex items-center justify-between text-xs text-[var(--text-silver)]">
          <span>Viewing within portfolio without external redirection.</span>
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download="Siddharth_Bade_Resume.pdf"
              className="btn btn-blood btn-sm"
            >
              <i className="fa-solid fa-download text-xs" />
              <span>SAVE PDF</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-glass btn-sm"
            >
              <span>CLOSE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
