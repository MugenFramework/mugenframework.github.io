export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Quick Start', href: '/docs/getting-started/quickstart' },
      { title: 'Troubleshooting', href: '/docs/getting-started/troubleshooting' },
    ],
  },
  {
    title: 'Teamserver',
    items: [
      { title: 'Listeners', href: '/docs/teamserver/listeners' },
      { title: 'Profiles', href: '/docs/teamserver/profiles' },
    ],
  },
  {
    title: 'Operator Manual',
    items: [
      { title: 'Sessions', href: '/docs/operator/sessions' },
      { title: 'Loot Manager', href: '/docs/operator/loot' },
      { title: 'Script Manager', href: '/docs/operator/scripts' },
      { title: 'Pivoting', href: '/docs/operator/pivoting' },
      { title: 'SOCKS5 Proxy', href: '/docs/operator/socks5' },
    ],
  },
  {
    title: 'Demon (Windows)',
    items: [
      { title: 'Overview', href: '/docs/agents/demon' },
      { title: 'Commands', href: '/docs/agents/demon/commands' },
      { title: 'C2 Profiles', href: '/docs/agents/demon/c2-profiles' },
      { title: 'OPSEC', href: '/docs/agents/demon/opsec' },
    ],
  },
  {
    title: 'Tengu (Linux)',
    items: [
      { title: 'Overview', href: '/docs/agents/tengu' },
      { title: 'Commands', href: '/docs/agents/tengu/commands' },
      { title: 'C2 Profiles', href: '/docs/agents/tengu/c2-profiles' },
      { title: 'OPSEC', href: '/docs/agents/tengu/opsec' },
    ],
  },
  {
    title: 'Python API',
    items: [
      { title: 'Overview', href: '/docs/python-api/overview' },
      { title: 'Command Registration', href: '/docs/python-api/commands' },
      { title: 'Credentials API', href: '/docs/python-api/credentials' },
      { title: 'Writing Modules', href: '/docs/python-api/modules' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { title: 'External C2', href: '/docs/advanced/external-c2' },
      { title: 'Custom Agent API', href: '/docs/advanced/custom-agent' },
    ],
  },
  {
    title: 'Roadmap',
    items: [
      { title: 'Roadmap', href: '/docs/roadmap' },
    ],
  },
]
