import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog-store"

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogPosts()
    return posts.map((p) => ({ slug: p.slug }))
  } catch (err) {
    console.warn("Could not generate static params for blog at build time:", err)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: `${post.title} | Ayushman Elder Care Service Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) notFound()

  const allPosts = await getPublishedBlogPosts()
  const otherPosts = allPosts.filter((p) => p.slug !== slug)

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative">
          <div className="relative aspect-21/9 max-h-105 w-full overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/40 to-foreground/10" />
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-4xl px-6 pb-10 md:pb-14">
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {post.category}
              </span>
              <h1 className="text-balance font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/70">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
            </div>
          </div>
        </section>

        {/* Article content */}
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <article className="prose-custom">
              {post.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </article>

            {/* CTA within article */}
            <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/15 p-8 md:p-10">
              <h3 className="font-serif text-xl font-bold text-foreground md:text-2xl">
                Need Help Caring for a Loved One?
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Our experienced care coordinators are available for a free
                consultation. Let us help you find the right care solution for
                your family.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get in Touch
                </Link>
                <Link
                  href="tel:+919883608282"
                  className="inline-flex items-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Call 9883608282 / 6290601110
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <section className="border-t border-border bg-secondary/50 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                More Articles
              </h2>
              <p className="mt-2 text-muted-foreground">
                Continue exploring our library of elder care resources.
              </p>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {otherPosts.map((p) => (
                  <Card
                    key={p.slug}
                    className="group overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={`/blog/${p.slug}`} className="block">
                      <div className="relative aspect-16/10 overflow-hidden">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                          {p.category}
                        </span>
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {p.date}
                      </div>
                      <Link href={`/blog/${p.slug}`}>
                        <h3 className="mt-3 text-lg font-bold leading-snug text-foreground transition-colors hover:text-primary">
                          {p.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
