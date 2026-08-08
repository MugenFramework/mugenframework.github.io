'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { search, type SearchItem } from '@/lib/search-index'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // '/' shortcut to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    setSelected(0)
    setResults(search(val))
    setOpen(true)
  }

  function navigate(item: SearchItem) {
    router.push(item.href)
    setOpen(false)
    setQuery('')
    setResults([])
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && results[selected]) {
      navigate(results[selected])
    }
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'var(--mu-bg)',
        border: '1px solid var(--mu-border)',
        borderRadius: '2px',
        padding: '0.25rem 0.6rem',
        transition: 'border-color 0.15s',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--mu-muted)', flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => { if (query) setOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--mu-text)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            lineHeight: 1,
          }}
        />
        {!query && (
          <kbd style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.5rem',
            color: 'var(--mu-muted)',
            background: 'var(--mu-surface)',
            border: '1px solid var(--mu-border)',
            borderRadius: '2px',
            padding: '0.1rem 0.3rem',
            lineHeight: 1.4,
          }}>
            /
          </kbd>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: 'var(--mu-surface)',
          border: '1px solid var(--mu-border)',
          borderRadius: '2px',
          zIndex: 100,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          {results.length === 0 ? (
            <div style={{
              padding: '0.75rem 1rem',
              fontSize: '0.65rem',
              color: 'var(--mu-muted)',
              fontFamily: "'Space Mono', monospace",
            }}>
              No results for "{query}"
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.href}
                onMouseDown={() => navigate(item)}
                onMouseEnter={() => setSelected(i)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  width: '100%',
                  padding: '0.6rem 1rem',
                  paddingLeft: 'calc(0.6rem - 2px)',
                  background: i === selected ? 'var(--mu-surface2)' : 'transparent',
                  border: 'none',
                  borderLeft: i === selected ? '2px solid var(--mu-red)' : '2px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--mu-text)',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                }}>
                  {item.title}
                </span>
                <span style={{
                  fontSize: '0.58rem',
                  color: 'var(--mu-muted)',
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {item.section}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
