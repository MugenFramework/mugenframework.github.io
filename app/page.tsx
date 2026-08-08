'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

const features = [
  { title: 'Demon', desc: 'Windows agent. Reflective DLL / EXE / Service. Sleep obf, indirect syscalls, BOF.', href: '/docs/agents/demon' },
  { title: 'Tengu', desc: 'Linux agent. HTTP/DNS/DoH/TCP. Sleep XOR, memfd, ELF BOF loader.', href: '/docs/agents/tengu' },
  { title: 'Python API', desc: 'Custom modules in Python. Access sessions, loot, and task queue.', href: '/docs/python-api/overview' },
  { title: 'Pivoting', desc: 'SMB pipe, TCP pivot, SOCKS5, reverse port forwarding.', href: '/docs/operator/pivoting' },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>

        {/* Hero */}
        <section style={{
          padding: '4rem 2.5rem 3rem',
          borderBottom: '1px solid var(--mu-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <img
            src="/logomugen-hero.png"
            alt="Mugen"
            style={{ height: '56px', width: 'auto', marginBottom: '1.25rem' }}
          />
          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--mu-text)',
            margin: 0,
            lineHeight: 1.1,
          }}>
            無限 Mugen<span style={{ color: 'var(--mu-red)', animation: 'blink 1.2s step-end infinite' }}>_</span>
          </h1>
          <p style={{
            color: 'var(--mu-muted)',
            fontSize: '0.8rem',
            maxWidth: '480px',
            margin: '0.9rem auto 0',
            lineHeight: 1.7,
          }}>
            Open-source C2 framework. Fork of Havoc (GPL-3.0), extended with the Tengu Linux agent, a Python module API, and additional post-exploitation tooling.
          </p>
          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.75rem' }}>
            <Link href="/docs/getting-started/installation" style={{
              padding: '0.45rem 1rem',
              background: 'var(--mu-red)',
              color: '#fff',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '2px',
            }}>
              Get Started
            </Link>
            <a href="https://github.com/MugenFramework/Mugen" target="_blank" rel="noopener" style={{
              padding: '0.45rem 1rem',
              border: '1px solid var(--mu-border)',
              color: 'var(--mu-text)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '2px',
            }}>
              GitHub
            </a>
          </div>
        </section>

        {/* Single main screenshot */}
        <section style={{
          padding: '2rem 2.5rem',
          borderBottom: '1px solid var(--mu-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img
            src="/screenshots/pivot.png"
            alt="Mugen C2 - session graph with SMB pivot, Tengu and Demon agents"
            style={{
              width: '100%',
              maxWidth: '820px',
              display: 'block',
              border: '1px solid var(--mu-border)',
              borderRadius: '2px',
            }}
          />
          <p style={{
            margin: '0.5rem 0 0',
            fontSize: '0.65rem',
            color: 'var(--mu-muted)',
            fontFamily: "'Space Mono', monospace",
          }}>
            Mugen client - session graph, SMB pivot, Tengu + Demon
          </p>
        </section>

        {/* Features grid */}
        <section style={{
          borderTop: '1px solid var(--mu-border)',
          borderBottom: '1px solid var(--mu-border)',
        }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px',
          background: 'var(--mu-border)',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              style={{
                display: 'block',
                padding: '1.5rem',
                background: 'var(--mu-bg)',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--mu-surface)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--mu-bg)')}
            >
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--mu-red)',
                marginBottom: '0.4rem',
              }}>
                {f.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--mu-muted)', lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </Link>
          ))}
        </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--mu-border)',
          padding: '1.1rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.66rem',
          color: 'var(--mu-muted)',
          fontFamily: "'Space Mono', monospace",
        }}>
          <span>Mugen - GPL-3.0</span>
          <span>Fork of <a href="https://github.com/HavocC2/Havoc" style={{ color: 'var(--mu-red)' }}>Havoc</a></span>
        </footer>
      </main>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </>
  )
}
