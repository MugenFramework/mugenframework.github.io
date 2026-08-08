'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { SearchBar } from './SearchBar'

const links = [
  { label: 'Docs', href: '/docs/getting-started/installation', match: '/docs' },
  { label: 'Blog', href: '/blog', match: '/blog' },
  { label: 'Contact', href: '/contact', match: '/contact' },
]

export function Navbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname()

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--navbar-height)',
        zIndex: 50,
        background: 'var(--mu-surface)',
        borderBottom: '1px solid var(--mu-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
      }}
    >
      <style>{`
        @media (min-width: 1024px) { .navbar-menu-btn { display: none !important; } }
        @media (max-width: 1023px) { .navbar-links { display: none !important; } }
      `}</style>

      {/* LEFT - logo + burger */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="navbar-menu-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--mu-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              flexShrink: 0,
            }}
            aria-label="Toggle menu"
          >
            <Menu size={15} />
          </button>
        )}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img src="/logomugen-hero.png" alt="Mugen" style={{ height: '20px', width: 'auto' }} />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--mu-text)',
            letterSpacing: '-0.02em',
          }}>
            無限 Mugen
          </span>
        </Link>
      </div>

      {/* CENTER - search */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '300px', flexShrink: 0 }}>
        <SearchBar />
      </div>

      {/* RIGHT - nav links + GitHub */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.1rem' }}>
        <nav className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
          {links.map((l) => {
            const active = pathname.startsWith(l.match)
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--mu-text)' : 'var(--mu-muted)',
                  textDecoration: 'none',
                  borderBottom: active ? '2px solid var(--mu-red)' : '2px solid transparent',
                  paddingBottom: 'calc(0.3rem - 2px)',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--mu-text)'
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--mu-muted)'
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <a
          href="https://github.com/MugenFramework/Mugen"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '0.5rem',
            color: 'var(--mu-muted)',
            textDecoration: 'none',
            transition: 'color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--mu-text)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--mu-muted)')}
          aria-label="GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
          </svg>
        </a>
      </div>
    </header>
  )
}
