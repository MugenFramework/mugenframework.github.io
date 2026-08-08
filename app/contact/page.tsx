'use client'

import { Navbar } from '@/components/Navbar'

const links = [
  {
    label: 'GitHub',
    href: 'https://github.com/MugenFramework/Mugen',
    desc: 'Source code, issues, pull requests',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'GitHub Organization',
    href: 'https://github.com/MugenFramework',
    desc: 'All repositories: Mugen, Modules, havoc-py, Talon, Karasu',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/0xbbuddha',
    desc: 'Follow @0xbbuddha for updates',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)', maxWidth: '600px', margin: '0 auto', padding: 'calc(var(--navbar-height) + 3rem) 2rem 4rem' }}>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--mu-text)',
          marginBottom: '0.25rem',
          marginTop: 0,
        }}>
          Contact
        </h1>
        <p style={{ color: 'var(--mu-muted)', fontSize: '0.78rem', marginBottom: '2.5rem', marginTop: 0 }}>
          For bug reports, feature requests, or questions - open an issue on GitHub.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--mu-border)' }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'var(--mu-surface)',
                textDecoration: 'none',
                borderLeft: '2px solid transparent',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderLeftColor = 'var(--mu-red)'
                el.style.background = 'var(--mu-surface2)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderLeftColor = 'transparent'
                el.style.background = 'var(--mu-surface)'
              }}
            >
              <span style={{ color: 'var(--mu-red)', flexShrink: 0 }}>{l.icon}</span>
              <div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--mu-text)',
                  marginBottom: '0.2rem',
                }}>
                  {l.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--mu-muted)' }}>
                  {l.desc}
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}
