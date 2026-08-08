'use client'

import Link from 'next/link'
import { navigation } from '@/lib/nav'

interface Crumb {
  label: string
  href?: string
}

function findPageTitle(href: string): { section: string; page: string } | null {
  for (const section of navigation) {
    for (const item of section.items ?? []) {
      if (item.href === href) {
        return { section: section.title, page: item.title }
      }
    }
  }
  return null
}

export function Breadcrumb({ slug }: { slug: string[] }) {
  const href = `/docs/${slug.join('/')}`
  const found = findPageTitle(href)

  const crumbs: Crumb[] = [{ label: 'Docs', href: '/docs/getting-started/installation' }]

  if (found) {
    crumbs.push({ label: found.section })
    crumbs.push({ label: found.page })
  } else {
    // fallback: humanize each slug segment
    slug.forEach((seg, i) => {
      const label = seg
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
      crumbs.push({ label, href: i === slug.length - 1 ? undefined : `/docs/${slug.slice(0, i + 1).join('/')}` })
    })
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.35rem',
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      color: 'var(--mu-muted)',
      marginBottom: '1.25rem',
      flexWrap: 'wrap',
    }}>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {i > 0 && (
            <span style={{ color: 'var(--mu-border)', userSelect: 'none' }}>/</span>
          )}
          {crumb.href ? (
            <Link
              href={crumb.href}
              style={{
                color: 'var(--mu-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--mu-text)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--mu-muted)')}
            >
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--mu-text)' }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
