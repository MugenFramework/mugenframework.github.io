'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation, NavItem } from '@/lib/nav'

function SidebarGroup({ item }: { item: NavItem }) {
  const pathname = usePathname()

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--mu-muted)',
          padding: '0 0.75rem',
          marginBottom: '0.25rem',
        }}
      >
        {item.title}
      </div>
      {item.items?.map((child) => {
        const active = pathname === child.href
        return (
          <Link
            key={child.href}
            href={child.href ?? '#'}
            style={{
              display: 'block',
              padding: '0.3rem 0.75rem',
              fontSize: '0.78rem',
              color: active ? 'var(--mu-red)' : 'var(--mu-muted)',
              textDecoration: 'none',
              borderLeft: active ? '2px solid var(--mu-red)' : '2px solid transparent',
              background: active ? 'var(--mu-red-dim)' : 'transparent',
              transition: 'color 0.15s, background 0.15s',
              lineHeight: 1.4,
            }}
            onMouseEnter={(e) => {
              if (!active) {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--mu-text)'
                el.style.background = 'var(--mu-surface2)'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'var(--mu-muted)'
                el.style.background = 'transparent'
              }
            }}
          >
            {child.title}
          </Link>
        )
      })}
    </div>
  )
}

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const isMobileOpen = open

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 39,
            background: 'rgba(0,0,0,0.6)',
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 'var(--navbar-height)',
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          background: 'var(--mu-surface)',
          borderRight: '1px solid var(--mu-border)',
          overflowY: 'auto',
          padding: '1.25rem 0',
          zIndex: 40,
          transform: isMobileOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.2s ease',
        }}
        className={isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      >
        {navigation.map((item) => (
          <SidebarGroup key={item.title} item={item} />
        ))}
      </aside>
    </>
  )
}
