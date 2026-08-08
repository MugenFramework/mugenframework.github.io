import { DocsLayout } from '@/components/DocsLayout'
import { MdxContent } from '@/components/MdxContent'
import { AgentTabView } from '@/components/AgentTabView'
import { getDoc } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demon',
  description: 'Demon Windows agent documentation - commands, C2 profiles and OPSEC guidance.',
}

const DemonSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" fill="none" width="52">
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

export default async function DemonPage() {
  const tabs = [
    { title: 'Overview',    slug: ['agents', 'demon'] },
    { title: 'Commands',    slug: ['agents', 'demon', 'commands'] },
    { title: 'C2 Profiles', slug: ['agents', 'demon', 'c2-profiles'] },
    { title: 'OPSEC',       slug: ['agents', 'demon', 'opsec'] },
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
          <DemonSVG />
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
              Agent - Windows
            </div>
            <h1 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--mu-text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Demon
            </h1>
            <div style={{ fontSize: '1.4rem', color: 'var(--mu-red)', opacity: 0.2, lineHeight: 1 }}>鬼</div>
          </div>
        </div>

        {/* Tabs */}
        <AgentTabView sections={sections} />
      </div>
    </DocsLayout>
  )
}
