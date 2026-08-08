'use client'

import { useState } from 'react'

export interface AgentSection {
  title: string
  content: React.ReactNode
}

const tabIcons: Record<string, React.ReactNode> = {
  'Overview': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  'Commands': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  'C2 Profiles': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="8" y1="12" x2="20" y2="12"/>
      <line x1="12" y1="18" x2="20" y2="18"/>
      <circle cx="4" cy="12" r="2"/>
      <circle cx="8" cy="18" r="2"/>
    </svg>
  ),
  'OPSEC': (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7h10c2.5-1.5 4-4 4-7 0-5-4-9-9-9z"/>
      <ellipse cx="8.5" cy="10" rx="2" ry="1.5"/>
      <ellipse cx="15.5" cy="10" rx="2" ry="1.5"/>
      <path d="M9 15.5c1 1 5 1 6 0"/>
      <line x1="8" y1="18" x2="10" y2="20"/>
      <line x1="16" y1="18" x2="14" y2="20"/>
    </svg>
  ),
}

export function AgentTabView({ sections }: { sections: AgentSection[] }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--mu-border)',
        marginBottom: '2rem',
        gap: 0,
        flexWrap: 'wrap',
      }}>
        {sections.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setActive(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1.1rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: active === i ? 'var(--mu-red)' : 'var(--mu-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: active === i ? '2px solid var(--mu-red)' : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tabIcons[s.title] ?? null}
            {s.title}
          </button>
        ))}
      </div>

      {/* Content panels */}
      {sections.map((s, i) => (
        <div key={s.title} style={{ display: active === i ? 'block' : 'none' }}>
          {s.content}
        </div>
      ))}
    </div>
  )
}
