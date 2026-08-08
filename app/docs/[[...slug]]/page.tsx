import { notFound } from 'next/navigation'
import { getDoc, getAllDocSlugs } from '@/lib/content'
import { extractHeadings } from '@/lib/headings'
import { MdxContent } from '@/components/MdxContent'
import { DocsLayout } from '@/components/DocsLayout'
import { TableOfContents } from '@/components/TableOfContents'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CommandsNav } from '@/components/CommandsNav'

interface Props {
  params: Promise<{ slug?: string[] }>
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const doc = getDoc(slug ?? [])
  if (!doc) return {}
  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: `${doc.title} - Mugen`,
      description: doc.description,
    },
    twitter: {
      title: `${doc.title} - Mugen`,
      description: doc.description,
    },
  }
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params
  const doc = getDoc(slug ?? [])

  if (!doc) notFound()

  const headings = extractHeadings(doc.content)

  return (
    <DocsLayout>
      <div style={{
        display: 'flex',
        gap: '2rem',
        padding: '2rem 2rem 4rem 2.5rem',
        alignItems: 'flex-start',
      }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          <Breadcrumb slug={slug ?? []} />
          {/* Mini-nav pour les sous-pages de commandes agents */}
          {slug && slug[0] === 'agents' && slug[2] === 'commands' && slug.length >= 4 && (
            <CommandsNav agent={slug[1] as 'demon' | 'tengu'} />
          )}
          {doc.description && (
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--mu-muted)',
              marginBottom: '0.25rem',
              marginTop: 0,
            }}>
              {doc.description}
            </p>
          )}
          <MdxContent source={doc.content} />
        </main>
        <TableOfContents headings={headings} />
      </div>
    </DocsLayout>
  )
}
