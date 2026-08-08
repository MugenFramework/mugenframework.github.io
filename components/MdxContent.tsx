import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { CodeBlock } from './CodeBlock'
import { slugify } from '@/lib/headings'

function getTextId(children: React.ReactNode, seen: Record<string, number>): string {
  const text = (function extract(node: React.ReactNode): string {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extract).join('')
    if (node && typeof node === 'object' && 'props' in node)
      return extract((node as any).props?.children)
    return ''
  })(children)
  const base = slugify(text)
  const count = seen[base] ?? 0
  seen[base] = count + 1
  return count === 0 ? base : `${base}-${count}`
}

const baseComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '1.4rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--mu-text)',
        marginBottom: '1rem',
        marginTop: 0,
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--mu-border)',
      }}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} style={{ marginBottom: '0.85rem', lineHeight: 1.7 }} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} style={{ color: 'var(--mu-red)', textUnderlineOffset: '3px' }} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} style={{ paddingLeft: '1.25rem', marginBottom: '0.85rem' }} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} style={{ paddingLeft: '1.25rem', marginBottom: '0.85rem' }} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li {...props} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = (props as any)['data-language'] !== undefined
    if (isBlock) return <code {...props} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.78rem' }} />
    return (
      <code
        {...props}
        style={{
          background: 'var(--mu-surface2)',
          color: 'var(--mu-red-soft)',
          border: '1px solid var(--mu-border)',
          padding: '0.1em 0.35em',
          borderRadius: '2px',
          fontSize: '0.85em',
          fontFamily: "'Space Mono', monospace",
        }}
      />
    )
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
      <table {...props} style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem' }} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      style={{
        background: 'var(--mu-surface2)',
        color: 'var(--mu-red)',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 700,
        border: '1px solid var(--mu-border)',
        padding: '0.4rem 0.65rem',
        textAlign: 'left',
      }}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} style={{ border: '1px solid var(--mu-border)', padding: '0.4rem 0.65rem', lineHeight: 1.5 }} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      style={{
        borderLeft: '2px solid var(--mu-red)',
        paddingLeft: '1rem',
        margin: '1rem 0',
        color: 'var(--mu-muted)',
        fontStyle: 'italic',
      }}
    />
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid var(--mu-border)', margin: '1.5rem 0' }} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} style={{ color: 'var(--mu-text)', fontWeight: 700 }} />
  ),
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const isSvgLogo = typeof src === 'string' && src.endsWith('.svg')
    return (
      <span style={{ display: 'block', margin: '1.5rem 0 1rem', textAlign: 'center' }}>
        <img
          src={src}
          alt={alt}
          {...props}
          style={{
            display: 'inline-block',
            width: isSvgLogo ? '72px' : undefined,
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </span>
    )
  },
}

const rehypePrettyCodeOptions = {
  theme: 'github-dark-dimmed',
  keepBackground: false,
}

export async function MdxContent({ source }: { source: string }) {
  // Per-render seen map: ensures duplicate heading texts get unique ids (setup, setup-1, ...)
  const seen: Record<string, number> = {}

  const components = {
    ...baseComponents,
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        {...props}
        id={getTextId(children, seen)}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'var(--mu-text)',
          marginTop: '2rem',
          marginBottom: '0.75rem',
          paddingBottom: '0.35rem',
          borderBottom: '1px solid var(--mu-border)',
          scrollMarginTop: 'calc(var(--navbar-height) + 1rem)',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        {...props}
        id={getTextId(children, seen)}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--mu-text)',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
          scrollMarginTop: 'calc(var(--navbar-height) + 1rem)',
        }}
      >
        {children}
      </h3>
    ),
  }

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          format: 'md',
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode as any, rehypePrettyCodeOptions]],
        },
      }}
    />
  )
}
