import { DocsLayout } from '@/components/DocsLayout'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agents',
  description: 'Choose the right Mugen agent for your target environment.',
}

const demonFeatures = [
  'Reflective DLL / EXE / Service',
  'BOF execution via CoffeeLdr',
  '.NET assembly execution',
  'Sleep obfuscation (Ekko, Zilean, Foliage)',
  'Indirect syscalls + AMSI/ETW bypass',
  'Token steal & impersonation',
  'Kerberos operations',
  'SMB named pipe + TCP pivot',
]

const tenguFeatures = [
  'Single ELF64, no dependencies',
  'ELF BOF inline-execute',
  'memfd in-memory execution',
  'XOR sleep obfuscation',
  'Credential harvesting',
  'Keylogger (X11 / /dev/input)',
  'Persistence (cron, systemd, bash)',
  'SOCKS5 + reverse port forward',
]

function AgentCard({
  name,
  kanji,
  os,
  lang,
  description,
  features,
  href,
  logo,
}: {
  name: string
  kanji: string
  os: string
  lang: string
  description: string
  features: string[]
  href: string
  logo: React.ReactNode
}) {
  return (
    <div style={{
      flex: '1 1 320px',
      border: '1px solid var(--mu-border)',
      borderTop: '2px solid var(--mu-red)',
      background: 'var(--mu-surface)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      position: 'relative',
    }}>
      {/* Logo + nom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ flexShrink: 0 }}>
          {logo}
        </div>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--mu-text)',
          }}>
            {name}
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: 'var(--mu-red)',
            opacity: 0.25,
            lineHeight: 1,
            marginTop: '0.1rem',
          }}>
            {kanji}
          </div>
        </div>
      </div>

      {/* Badges OS / lang */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[os, lang].map((tag) => (
          <span key={tag} style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--mu-red)',
            border: '1px solid var(--mu-red)',
            opacity: 0.75,
            padding: '0.15rem 0.5rem',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.78rem',
        color: 'var(--mu-muted)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {description}
      </p>

      {/* Features */}
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        flex: 1,
      }}>
        {features.map((f) => (
          <li key={f} style={{
            fontSize: '0.72rem',
            color: 'var(--mu-muted)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem',
          }}>
            <span style={{ color: 'var(--mu-red)', opacity: 0.6, flexShrink: 0 }}>-</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={href} style={{
        display: 'block',
        textAlign: 'center',
        padding: '0.55rem 1rem',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--mu-red)',
        border: '1px solid var(--mu-red)',
        textDecoration: 'none',
        opacity: 0.85,
        transition: 'opacity 0.15s',
      }}>
        View docs →
      </Link>
    </div>
  )
}

const DemonSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" fill="none" width="64">
    <path d="M 26 28 L 16 2 L 38 20 Z" fill="#ff2244"/>
    <path d="M 74 28 L 84 2 L 62 20 Z" fill="#ff2244"/>
    <path d="M 14 36 C 14 22 26 20 50 20 C 74 20 86 22 86 36 L 86 72 C 86 90 66 104 50 106 C 34 104 14 90 14 72 Z" fill="rgba(255,34,68,0.07)" stroke="#ff2244" strokeWidth="2.5"/>
    <line x1="16" y1="46" x2="43" y2="37" stroke="#ff2244" strokeWidth="4" strokeLinecap="round"/>
    <line x1="57" y1="37" x2="84" y2="46" stroke="#ff2244" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="32" cy="56" rx="13" ry="9" fill="rgba(255,34,68,0.1)" stroke="#ff2244" strokeWidth="2"/>
    <circle cx="32" cy="56" r="4.5" fill="#ff2244"/>
    <ellipse cx="68" cy="56" rx="13" ry="9" fill="rgba(255,34,68,0.1)" stroke="#ff2244" strokeWidth="2"/>
    <circle cx="68" cy="56" r="4.5" fill="#ff2244"/>
    <path d="M 43 68 L 50 74 L 57 68 Z" fill="#ff2244" stroke="#ff2244" strokeWidth="1" strokeLinejoin="round"/>
    <line x1="22" y1="82" x2="78" y2="82" stroke="#ff2244" strokeWidth="1.5"/>
    <path d="M 22 82 Q 50 94 78 82" stroke="#ff2244" strokeWidth="2"/>
    <rect x="33" y="82" width="7" height="10" rx="1" fill="#ff2244"/>
    <rect x="60" y="82" width="7" height="10" rx="1" fill="#ff2244"/>
  </svg>
)

const TenguSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112" fill="none" width="52">
    <path d="M 18 33 C 16 16 28 8 50 8 C 72 8 84 16 82 33 L 82 62 C 82 76 68 82 50 82 C 32 82 18 76 18 62 Z" fill="rgba(255,34,68,0.07)" stroke="#ff2244" strokeWidth="2.5"/>
    <line x1="36" y1="20" x2="64" y2="20" stroke="#ff2244" strokeWidth="1" opacity="0.3"/>
    <line x1="39" y1="25" x2="61" y2="25" stroke="#ff2244" strokeWidth="0.8" opacity="0.2"/>
    <path d="M 19 37 Q 29 31 39 35" stroke="#ff2244" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 61 35 Q 71 31 81 37" stroke="#ff2244" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 19 46 Q 29 40 39 46 Q 29 52 19 46 Z" fill="rgba(255,34,68,0.12)" stroke="#ff2244" strokeWidth="1.8"/>
    <ellipse cx="29" cy="46" rx="4.5" ry="3" fill="#ff2244"/>
    <path d="M 61 46 Q 71 40 81 46 Q 71 52 61 46 Z" fill="rgba(255,34,68,0.12)" stroke="#ff2244" strokeWidth="1.8"/>
    <ellipse cx="71" cy="46" rx="4.5" ry="3" fill="#ff2244"/>
    <path d="M 43 54 L 45 100 L 50 106 L 55 100 L 57 54 Q 50 60 43 54 Z" fill="#ff2244" stroke="#ff2244" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M 36 70 Q 50 75 64 70" stroke="#ff2244" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export default function AgentsPage() {
  return (
    <DocsLayout>
      <div style={{ padding: '2rem 2rem 4rem 2.5rem', maxWidth: '900px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--mu-red)',
            opacity: 0.7,
            marginBottom: '0.5rem',
          }}>
            Mugen C2 - Agents
          </p>
          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--mu-text)',
            margin: '0 0 0.75rem',
          }}>
            Choose your agent
          </h1>
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--mu-muted)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: 0,
          }}>
            Mugen ships two agents built for different environments.
            Pick the one that matches your target - they share the same C2 infrastructure
            and operator workflow.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <AgentCard
            name="Demon"
            kanji="鬼"
            os="Windows"
            lang="C + ASM"
            description="The default Windows implant. Full-featured post-exploitation toolkit targeting x64 Windows 7 and later, forked from Havoc and extended with additional evasion capabilities."
            features={demonFeatures}
            href="/docs/agents/demon"
            logo={<DemonSVG />}
          />
          <AgentCard
            name="Tengu"
            kanji="天狗"
            os="Linux"
            lang="C"
            description="A lightweight Linux implant that ships as a single ELF64 binary with zero runtime dependencies. Covers the full post-exploitation lifecycle on Linux targets."
            features={tenguFeatures}
            href="/docs/agents/tengu"
            logo={<TenguSVG />}
          />
        </div>
      </div>
    </DocsLayout>
  )
}
