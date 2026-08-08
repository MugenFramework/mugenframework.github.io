export interface Heading {
  level: 2 | 3
  text: string
  id: string
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`[^`]*`/g, (m) => m.replace(/[^\w]/g, ''))
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const seen: Record<string, number> = {}

  for (const line of markdown.split('\n')) {
    const h2 = line.match(/^## (.+)/)
    const h3 = line.match(/^### (.+)/)
    const match = h2 ?? h3
    if (!match) continue

    const level = h2 ? 2 : 3
    const text = match[1].replace(/[*_`[\]]/g, '').trim()
    const base = slugify(text)
    const count = seen[base] ?? 0
    seen[base] = count + 1
    const id = count === 0 ? base : `${base}-${count}`
    headings.push({ level: level as 2 | 3, text, id })
  }
  return headings
}
