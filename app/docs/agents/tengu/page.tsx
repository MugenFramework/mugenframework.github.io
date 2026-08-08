import { DocsLayout } from '@/components/DocsLayout'
import { MdxContent } from '@/components/MdxContent'
import { AgentTabView } from '@/components/AgentTabView'
import { getDoc } from '@/lib/content'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tengu',
  description: 'Tengu Linux agent documentation - commands, C2 profiles and OPSEC guidance.',
}

const TenguSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112" fill="none" width="45">
    <path d="M 18 33 C 16 16 28 8 50 8 C 72 8 84 16 82 33 L 82 62 C 82 76 68 82 50 82 C 32 82 18 76 18 62 Z" fill="rgba(255,34,68,0.07)" stroke="#ff2244" strokeWidth="2.5"/>
    <line x1="36" y1="20" x2="64" y2="20" stroke="#ff2244" strokeWidth="1" opacity="0.3"/>
    <line x1="39" y1="25" x2="61" y2="25" stroke="#ff2244" strokeWidth="0.8" opacity="0.2"/>
    <path d="M 19 37 Q 29 31 39 35" stroke="#ff2244" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 61 35 Q 71 31 81 37" stroke="#ff2244" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M 19 46 Q 29 40 39 46 Q 29 52 19 46 Z" fill="rgba(255,34,68,0.12)" stroke="#ff2244" strokeWidth="1.8"/>
    <ellipse cx="29" cy="46" rx="4.5" ry="3" fill="#ff2244"/>
    <path d="M 61 46 Q 71 40 81 46 Q 71 52 61 46 Z" fill="rgba(255,34,68,0.12)" stroke="#ff2244" strokeWidth="1.8"/>
    <ellipse cx="71" cy="46" rx="4.5" ry="3" fill="#ff2244"/>
    <path d="M 43 54 L 45 100 L 50 106 L 55 100 L 57 54 Q 50 60 43 54 Z" fill="#ff2244" stroke="#ff2244" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M 36 70 Q 50 75 64 70" stroke="#ff2244" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const commandGroups = [
  { title: 'Identity',       href: '/docs/agents/tengu/commands/identity',      desc: 'whoami, id, env, pwd' },
  { title: 'File System',    href: '/docs/agents/tengu/commands/filesystem',    desc: 'ls, cd, pwd, cat, download, upload, mkdir, rm, cp, chmod' },
  { title: 'Processes',      href: '/docs/agents/tengu/commands/processes',     desc: 'ps, kill' },
  { title: 'Execution',      href: '/docs/agents/tengu/commands/execution',     desc: 'shell, memfd, inline-execute, screenshot' },
  { title: 'Network Recon',  href: '/docs/agents/tengu/commands/network-recon', desc: 'netstat, arp, route, ifconfig, portscan' },
  { title: 'Credentials',    href: '/docs/agents/tengu/commands/credentials',   desc: 'harvest, procdump, keylog' },
  { title: 'Persistence',    href: '/docs/agents/tengu/commands/persistence',   desc: 'persist cron/systemd/bash' },
  { title: 'Privesc',        href: '/docs/agents/tengu/commands/privesc',       desc: 'privesc (SUID, sudo, writable PATH, capabilities)' },
  { title: 'Pivoting',       href: '/docs/agents/tengu/commands/pivoting',      desc: 'socks5 start/stop, rportfwd add/list/rm, pivot tcp listen' },
]

const CommandsOverview = () => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {commandGroups.map((g, i) => (
        <Link
          key={g.href}
          href={g.href}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '1rem',
            padding: '0.65rem 0',
            borderBottom: '1px solid var(--mu-border)',
            borderTop: i === 0 ? '1px solid var(--mu-border)' : 'none',
            textDecoration: 'none',
          }}
        >
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--mu-red)',
            whiteSpace: 'nowrap',
            minWidth: '130px',
          }}>
            {g.title}
          </span>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--mu-muted)',
            flex: 1,
          }}>
            {g.desc}
          </span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            color: 'var(--mu-muted)',
            opacity: 0.5,
            flexShrink: 0,
          }}>
            {'->'}
          </span>
        </Link>
      ))}
    </div>
  </div>
)

export default async function TenguPage() {
  const tabs = [
    { title: 'Overview',    slug: ['agents', 'tengu'] },
    { title: 'C2 Profiles', slug: ['agents', 'tengu', 'c2-profiles'] },
    { title: 'OPSEC',       slug: ['agents', 'tengu', 'opsec'] },
  ]

  const sections = [
    ...tabs.map((t) => ({
      title: t.title,
      content: <MdxContent source={getDoc(t.slug)?.content ?? ''} />,
    })),
  ]

  sections.splice(1, 0, {
    title: 'Commands',
    content: <CommandsOverview />,
  })

  return (
    <DocsLayout>
      <div style={{ padding: '2rem 2rem 4rem 2.5rem', maxWidth: '860px' }}>

        {/* Header agent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--mu-border)',
        }}>
          <TenguSVG />
          <div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--mu-red)',
              opacity: 0.7,
              marginBottom: '0.3rem',
            }}>
              Agent - Linux
            </div>
            <h1 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--mu-text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Tengu
            </h1>
            <div style={{ fontSize: '1.4rem', color: 'var(--mu-red)', opacity: 0.2, lineHeight: 1 }}>天狗</div>
          </div>
        </div>

        {/* Tabs */}
        <AgentTabView sections={sections} />
      </div>
    </DocsLayout>
  )
}
