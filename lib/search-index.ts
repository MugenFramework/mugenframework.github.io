import { navigation } from './nav'

export interface SearchItem {
  title: string
  href: string
  section: string
  type: 'doc' | 'blog'
}

// Doc pages from nav
const docItems: SearchItem[] = navigation.flatMap((section) =>
  (section.items ?? []).map((item) => ({
    title: item.title,
    href: item.href ?? '#',
    section: section.title,
    type: 'doc' as const,
  }))
)

// Blog posts (static list - update when adding posts)
const blogItems: SearchItem[] = [
  {
    title: 'Mugen v0.1 - The Fragrant Flower Blooms With Dignity',
    href: '/blog/mugen-v0.1-release',
    section: 'Blog',
    type: 'blog',
  },
  {
    title: 'Linux ELF BOFs with Tengu',
    href: '/blog/linux-elf-bof',
    section: 'Blog',
    type: 'blog',
  },
]

export const searchIndex: SearchItem[] = [...docItems, ...blogItems]

export function search(query: string): SearchItem[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return searchIndex.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q)
  ).slice(0, 8)
}
