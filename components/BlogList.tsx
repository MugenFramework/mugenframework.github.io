'use client'

import Link from 'next/link'

interface Post {
  slug: string
  title: string
  description?: string
  date?: string
}

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p style={{ color: 'var(--mu-muted)', fontSize: '0.78rem' }}>No posts yet.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--mu-border)' }}>
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          style={{
            display: 'block',
            padding: '1.25rem 1.5rem',
            background: 'var(--mu-surface)',
            textDecoration: 'none',
            borderLeft: '2px solid transparent',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderLeftColor = 'var(--mu-red)'
            el.style.background = 'var(--mu-surface2)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderLeftColor = 'transparent'
            el.style.background = 'var(--mu-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem', gap: '1rem' }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--mu-text)',
            }}>
              {post.title}
            </span>
            {post.date && (
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                color: 'var(--mu-muted)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {post.date}
              </span>
            )}
          </div>
          {post.description && (
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--mu-muted)', lineHeight: 1.6 }}>
              {post.description}
            </p>
          )}
        </Link>
      ))}
    </div>
  )
}
