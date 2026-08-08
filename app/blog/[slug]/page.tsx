import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogSlugs } from '@/lib/blog'
import { MdxContent } from '@/components/MdxContent'
import { Navbar } from '@/components/Navbar'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: `${post.title} - Mugen`,
      description: post.description,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: 'summary',
      title: `${post.title} - Mugen`,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'calc(var(--navbar-height) + 3rem) 2rem 5rem',
      }}>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--mu-text)',
          margin: 0,
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}>
          {post.title}
        </h1>
        {post.date && (
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            color: 'var(--mu-muted)',
            marginTop: '0.4rem',
            marginBottom: '2rem',
          }}>
            {post.date}{post.author ? ` - ${post.author}` : ''}
          </p>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid var(--mu-border)', marginBottom: '2rem' }} />
        <MdxContent source={post.content} />
      </main>
    </>
  )
}
