'use client'

import { useState, useEffect } from 'react'
import type { Heading } from '@/lib/headings'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: `-${48 + 16}px 0px -70% 0px`,
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <>
      <style>{`
        @media (max-width: 1280px) { .toc-panel { display: none !important; } }
      `}</style>
      <aside
        className="toc-panel"
        style={{
          width: '200px',
          flexShrink: 0,
          position: 'sticky',
          top: 'calc(var(--navbar-height) + 2rem)',
          height: 'fit-content',
          alignSelf: 'flex-start',
        }}
      >
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.58rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--mu-muted)',
          marginBottom: '0.6rem',
        }}>
          On this page
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {headings.map(({ id, text, level }, i) => {
            const active = activeId === id
            return (
              <a
                key={`${id}-${i}`}
                href={`#${id}`}
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  lineHeight: 1.5,
                  color: active ? 'var(--mu-red)' : 'var(--mu-muted)',
                  textDecoration: 'none',
                  paddingLeft: level === 3 ? '0.75rem' : '0',
                  borderLeft: active ? '2px solid var(--mu-red)' : '2px solid transparent',
                  paddingTop: '0.2rem',
                  paddingBottom: '0.2rem',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--mu-text)'
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--mu-muted)'
                }}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(id)
                }}
              >
                {text}
              </a>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
