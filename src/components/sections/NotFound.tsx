import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Page Not Found | Siddharth Bade'
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050206',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Outfit, sans-serif',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255,0,60,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 404 Number */}
      <div
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ff003c, #660014)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 40px rgba(255,0,60,0.4))',
          marginBottom: '1rem',
        }}
      >
        404
      </div>

      {/* Divider */}
      <div
        style={{
          width: '80px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #ff003c, transparent)',
          marginBottom: '1.5rem',
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
          fontWeight: 800,
          letterSpacing: '0.05em',
          marginBottom: '0.75rem',
          color: '#ffffff',
        }}
      >
        PAGE NOT FOUND
      </h1>

      {/* Subtitle */}
      <p
        style={{
          color: '#c4b5c7',
          fontSize: '1rem',
          maxWidth: '400px',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
        }}
      >
        The page you're looking for has vanished into the void. Let's get you back on track.
      </p>

      {/* CTA */}
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.95rem 2.1rem',
          background: 'linear-gradient(135deg, #ff003c, #660014)',
          color: '#fff',
          border: '1px solid #b30026',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.88rem',
          letterSpacing: '0.12em',
          textDecoration: 'none',
          boxShadow: '0 0 25px rgba(255,0,60,0.35)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'
          ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 40px rgba(255,0,60,0.6)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
          ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 25px rgba(255,0,60,0.35)'
        }}
      >
        ← RETURN HOME
      </a>

      {/* Sub links */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { label: 'PROJECTS', href: '/#projects' },
          { label: 'ABOUT', href: '/#about' },
          { label: 'CONTACT', href: '/#contact' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: 'rgba(196,181,199,0.7)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#ff003c')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(196,181,199,0.7)')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
