import { Navbar } from '@/components/Navbar'
import { BlogList } from '@/components/BlogList'
import { getAllBlogSlugs, getBlogPost } from '@/lib/blog'

export default function BlogPage() {
  const slugs = getAllBlogSlugs()
  const posts = slugs
    .map((slug) => getBlogPost(slug))
    .filter(Boolean)
    .map((p) => ({
      slug: p!.slug,
      title: p!.title,
      description: p!.description,
      date: p!.date,
    }))
    .sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.localeCompare(a.date)
    })

  return (
    <>
      <Navbar />
      <main style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'calc(var(--navbar-height) + 3rem) 2rem 4rem',
      }}>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--mu-text)',
          marginBottom: '0.25rem',
          marginTop: 0,
        }}>
          Blog
        </h1>
        <p style={{ color: 'var(--mu-muted)', fontSize: '0.78rem', marginBottom: '2.5rem', marginTop: 0 }}>
          Technical writeups and release notes.
        </p>
        <BlogList posts={posts} />
      </main>
    </>
  )
}
