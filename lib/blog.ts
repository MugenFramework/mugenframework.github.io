import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDir = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  description?: string
  date?: string
  author?: string
  content: string
}

export function getBlogPost(slug: string): BlogPost | null {
  const candidates = [
    path.join(blogDir, slug + '.md'),
    path.join(blogDir, slug + '.mdx'),
  ]
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title ?? slug,
        description: data.description,
        date: data.date,
        author: data.author,
        content,
      }
    }
  }
  return null
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return []
  return fs.readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''))
}
