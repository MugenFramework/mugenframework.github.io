'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CommandGroup {
  title: string
  href: string
}

const demonGroups: CommandGroup[] = [
  { title: 'File System',    href: '/docs/agents/demon/commands/filesystem' },
  { title: 'Execution',      href: '/docs/agents/demon/commands/execution' },
  { title: 'Processes',      href: '/docs/agents/demon/commands/processes' },
  { title: 'Tokens',         href: '/docs/agents/demon/commands/tokens' },
  { title: 'Network Recon',  href: '/docs/agents/demon/commands/network-recon' },
  { title: 'Kerberos',       href: '/docs/agents/demon/commands/kerberos' },
  { title: 'Jobs',           href: '/docs/agents/demon/commands/jobs' },
  { title: 'Pivoting',       href: '/docs/agents/demon/commands/pivoting' },
  { title: 'Config',         href: '/docs/agents/demon/commands/config' },
]

const tenguGroups: CommandGroup[] = [
  { title: 'Identity',       href: '/docs/agents/tengu/commands/identity' },
  { title: 'File System',    href: '/docs/agents/tengu/commands/filesystem' },
  { title: 'Processes',      href: '/docs/agents/tengu/commands/processes' },
  { title: 'Execution',      href: '/docs/agents/tengu/commands/execution' },
  { title: 'Network Recon',  href: '/docs/agents/tengu/commands/network-recon' },
  { title: 'Credentials',    href: '/docs/agents/tengu/commands/credentials' },
  { title: 'Persistence',    href: '/docs/agents/tengu/commands/persistence' },
  { title: 'Privesc',        href: '/docs/agents/tengu/commands/privesc' },
  { title: 'Pivoting',       href: '/docs/agents/tengu/commands/pivoting' },
]

export function CommandsNav({ agent }: { agent: 'demon' | 'tengu' }) {
  const pathname = usePathname()
  const normalized = pathname.replace(/\/$/, '')
  const groups = agent === 'demon' ? demonGroups : tenguGroups
  const backHref = `/docs/agents/${agent}`

  return (
    <div style={{
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--mu-border)',
    }}>
      {/* Back link */}
      <div style={{ marginBottom: '0.75rem' }}>
        <Link
          href={backHref}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--mu-muted)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span style={{ fontSize: '0.7rem' }}>{'<-'}</span>
          {agent === 'demon' ? 'Demon' : 'Tengu'}
        </Link>
      </div>

      {/* Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
      }}>
        {groups.map((g) => {
          const active = normalized === g.href.replace(/\/$/, '')
          return (
            <Link
              key={g.href}
              href={g.href}
              style={{
                padding: '0.25rem 0.65rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                border: active ? '1px solid var(--mu-red)' : '1px solid var(--mu-border)',
                color: active ? 'var(--mu-red)' : 'var(--mu-muted)',
                background: active ? 'var(--mu-red-dim)' : 'transparent',
                borderRadius: '2px',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {g.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
