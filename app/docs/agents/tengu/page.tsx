import { DocsLayout } from '@/components/DocsLayout'
import { MdxContent } from '@/components/MdxContent'
import { AgentTabView } from '@/components/AgentTabView'
import { getDoc } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tengu',
  description: 'Tengu Linux agent documentation - commands, C2 profiles and OPSEC guidance.',
}

const TenguSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112" fill="none" width="45">
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

export default async function TenguPage() {
  const tabs = [
    { title: 'Overview',    slug: ['agents', 'tengu'] },
    { title: 'Commands',    slug: ['agents', 'tengu', 'commands'] },
    { title: 'C2 Profiles', slug: ['agents', 'tengu', 'c2-profiles'] },
    { title: 'OPSEC',       slug: ['agents', 'tengu', 'opsec'] },
  ]

  const sections = tabs.map((t) => ({
    title: t.title,
    content: <MdxContent source={getDoc(t.slug)?.content ?? ''} />,
  }))

  return (
    <DocsLayout>
      <div style={{ padding: '2rem 2rem 4rem 2.5rem', maxWidth: '860px' }}>

        {/* Header agent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--mu-border)',
        }}>
          <TenguSVG />
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--mu-red)',
              opacity: 0.7,
              marginBottom: '0.3rem',
            }}>
              Agent - Linux
            </div>
            <h1 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--mu-text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Tengu
            </h1>
            <div style={{ fontSize: '1.4rem', color: 'var(--mu-red)', opacity: 0.2, lineHeight: 1 }}>天狗</div>
          </div>
        </div>

        {/* Tabs */}
        <AgentTabView sections={sections} />
      </div>
    </DocsLayout>
  )
}
