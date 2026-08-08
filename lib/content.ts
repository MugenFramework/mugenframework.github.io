import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface DocMeta {
  title: string
  description?: string
  slug: string[]
}

export interface Doc extends DocMeta {
  content: string
}

export function getDoc(slug: string[]): Doc | null {
  const candidates = [
    path.join(contentDir, ...slug) + '.mdx',
    path.join(contentDir, ...slug) + '.md',
    path.join(contentDir, ...slug, 'index.mdx'),
    path.join(contentDir, ...slug, 'index.md'),
  ]

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8')
      const { data, content } = matter(raw)
      return {
        title: data.title ?? slug[slug.length - 1],
        description: data.description,
        slug,
        content,
      }
    }
  }
  return null
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = []
  walk(contentDir, [], slugs)
  return slugs
}

// Directories excluded from doc slug scanning (handled separately)
const EXCLUDED_DIRS = new Set(['blog'])

function walk(dir: string, prefix: string[], acc: string[][]) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir)) {
    // Skip excluded top-level dirs
    if (prefix.length === 0 && EXCLUDED_DIRS.has(entry)) continue
    const full = path.join(dir, entry)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      walk(full, [...prefix, entry], acc)
    } else if (entry === 'index.md' || entry === 'index.mdx') {
      acc.push(prefix)
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      acc.push([...prefix, entry.replace(/\.mdx?$/, '')])
    }
  }
}
