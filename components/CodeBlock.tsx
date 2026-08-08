'use client'

import { useState, useRef } from 'react'

export function CodeBlock({ children, style, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLPreElement>(null)
  const lang = (props as any)['data-language'] as string | undefined

  function copy() {
    const text = ref.current?.innerText ?? ''
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <pre
        ref={ref}
        {...props}
        style={{
          background: 'var(--mu-surface)',
          border: '1px solid var(--mu-border)',
          borderLeft: '2px solid var(--mu-red)',
          borderRadius: '2px',
          padding: '0.85rem 1rem',
          paddingTop: lang ? '2rem' : '0.85rem',
          paddingRight: '3rem',
          overflowX: 'auto',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          fontFamily: "'Space Mono', monospace",
          margin: 0,
          ...style,
        }}
      >
        {children}
      </pre>

      {lang && (
        <span style={{
          position: 'absolute',
          top: '0.4rem',
          left: '0.75rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.55rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--mu-red)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {lang}
        </span>
      )}

      <button
        onClick={copy}
        title="Copy"
        style={{
          position: 'absolute',
          top: '0.4rem',
          right: '0.5rem',
          background: copied ? 'var(--mu-red-dim)' : 'transparent',
          border: '1px solid',
          borderColor: copied ? 'var(--mu-red)' : 'var(--mu-border)',
          color: copied ? 'var(--mu-red)' : 'var(--mu-muted)',
          borderRadius: '2px',
          padding: '0.2rem 0.45rem',
          cursor: 'pointer',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.55rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'color 0.15s, border-color 0.15s, background 0.15s',
          lineHeight: 1,
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
