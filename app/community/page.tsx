import React from 'react'
import { Navbar } from '@/components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community',
  description: 'The people behind Mugen and how to get involved.',
}

const maintainers = [
  {
    login: '0xbbuddha',
    name: '0xbbuddha',
    role: 'Author & maintainer',
    bio: 'Main account. Development of the Mugen framework - C2 infrastructure, Demon, Tengu, operator tooling.',
    github: 'https://github.com/0xbbuddha',
    website: 'https://0xbbuddha.fr',
    twitter: 'https://x.com/0xbbuddha',
  },
  {
    login: 'Koshmare-Blossom',
    name: 'Koshmare-Blossom',
    role: 'Malware dev',
    bio: 'Secondary account dedicated to malware development work - implant internals, evasion research, low-level agent features.',
    github: 'https://github.com/Koshmare-Blossom',
    website: 'https://koshmare-blossom.github.io',
    twitter: 'https://x.com/koshmareflower',
  },
]

const linkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.62rem',
  color: 'var(--mu-muted)',
  textDecoration: 'none',
  letterSpacing: '0.02em',
}

function MaintainerCard({ m }: { m: typeof maintainers[0] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        border: '1px solid var(--mu-border)',
        borderTop: '2px solid var(--mu-red)',
        background: 'var(--mu-surface)',
        flex: '1 1 260px',
      }}
    >
      {/* Avatar + nom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img
          src={`https://github.com/${m.login}.png?size=80`}
          alt={m.name}
          width={52}
          height={52}
          style={{
            borderRadius: '50%',
            border: '2px solid var(--mu-border)',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--mu-text)',
            letterSpacing: '-0.01em',
          }}>
            {m.name}
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--mu-red)',
            opacity: 0.75,
            marginTop: '0.2rem',
          }}>
            {m.role}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p style={{
        fontSize: '0.73rem',
        color: 'var(--mu-muted)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {m.bio}
      </p>

      {/* Liens */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: 'auto' }}>
        <a href={m.github} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {/* GitHub icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
          </svg>
          GitHub
        </a>
        <a href={m.website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {/* Globe icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Website
        </a>
        <a href={m.twitter} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {/* X icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X
        </a>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main style={{
        paddingTop: 'var(--navbar-height)',
        maxWidth: '760px',
        margin: '0 auto',
        padding: 'var(--navbar-height) 2rem 5rem',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', paddingTop: '3rem' }}>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--mu-red)',
            opacity: 0.7,
            marginBottom: '0.5rem',
          }}>
            Community
          </p>
          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--mu-text)',
            margin: '0 0 1rem',
          }}>
            The people behind Mugen
          </h1>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--mu-muted)',
            lineHeight: 1.75,
            maxWidth: '540px',
            margin: 0,
          }}>
            Mugen is an open-source C2 framework built for red teamers.
            It started as a fork of Havoc and has since grown into its own project,
            with the Tengu Linux agent, a Python module API, and a focus on clean operator experience.
            The project is maintained by a single person across two accounts, and welcomes contributions from the community.
          </p>
        </div>

        <div style={{ height: '1px', background: 'var(--mu-border)', marginBottom: '3rem' }} />

        {/* Maintainers */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--mu-muted)',
            marginBottom: '1.25rem',
          }}>
            Maintainers
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {maintainers.map((m) => (
              <MaintainerCard key={m.login} m={m} />
            ))}
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--mu-border)', marginBottom: '3rem' }} />

        {/* Discord */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--mu-muted)',
            marginBottom: '1.25rem',
          }}>
            Discord
          </h2>
          <div style={{
            padding: '1rem 1.25rem',
            border: '1px solid var(--mu-border)',
            borderLeft: '2px solid var(--mu-border)',
            background: 'var(--mu-surface)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--mu-muted)',
              background: 'var(--mu-surface2)',
              padding: '0.2rem 0.5rem',
              flexShrink: 0,
            }}>
              No server
            </span>
            <p style={{
              fontSize: '0.76rem',
              color: 'var(--mu-muted)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              There is no Discord server at the moment. If the project gets enough traction, one might be created - or not.
              GitHub Issues remains the primary place for questions and bug reports.
            </p>
          </div>
        </section>

        <div style={{ height: '1px', background: 'var(--mu-border)', marginBottom: '3rem' }} />

        {/* Contributing */}
        <section>
          <h2 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--mu-muted)',
            marginBottom: '1.25rem',
          }}>
            Contributing
          </h2>
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--mu-muted)',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
          }}>
            Contributions are welcome - bug reports, feature requests, documentation improvements,
            or new capabilities. Read the contributing guide before opening a pull request to understand
            the code style, commit conventions, and what kinds of changes are in scope.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/MugenFramework/Mugen/blob/main/CONTRIBUTING.MD"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.1rem',
                background: 'var(--mu-red)',
                color: '#fff',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
              }}
            >
              {'Read CONTRIBUTING.md ->'}
            </a>
            <a
              href="https://github.com/MugenFramework/Mugen/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1.1rem',
                border: '1px solid var(--mu-border)',
                color: 'var(--mu-text)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
              }}
            >
              {'Open an issue ->'}
            </a>
          </div>
        </section>

      </main>
    </>
  )
}
