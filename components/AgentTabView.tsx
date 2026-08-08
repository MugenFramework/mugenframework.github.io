'use client'

import { useState } from 'react'

export interface AgentSection {
  title: string
  content: React.ReactNode
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
        overflowX: 'auto',
      }}>
        {sections.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setActive(i)}
            style={{
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
