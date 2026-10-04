import Image from "next/image"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RichHtml } from "@/components/ui/rich-html"
import { AboutSectionData, defaultLandingPageData } from "@/lib/landing-page-data"

interface AboutProps {
  data?: AboutSectionData
}

export function About({ data = defaultLandingPageData.about }: AboutProps) {
  const content = data || defaultLandingPageData.about

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        {content.badge && (
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {content.badge}
            </span>
          </div>
        )}

        <RichHtml
          as="h2"
          content={content.titleHtml}
          className="text-balance text-center font-serif text-3xl font-bold text-foreground md:text-4xl"
        />

        <RichHtml
          as="div"
          content={content.subtitleHtml}
          className="mx-auto mt-4 max-w-2xl text-pretty text-center text-lg leading-relaxed text-muted-foreground"
        />

        <div className="mt-16 flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Image */}
          <div className="relative flex-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              {content.image ? (
                <Image
                  src={content.image}
                  alt="Caregiver assisting an elderly person at home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={content.image.startsWith('http')}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  No about image set
                </div>
              )}
            </div>
            {/* Accent decoration */}
            <div className="absolute -top-3 -right-3 -z-10 h-full w-full rounded-2xl bg-primary/10" />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            {content.storyTitle && (
              <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                {content.storyTitle}
              </h3>
            )}

            <RichHtml
              as="div"
              content={content.storyParagraph1Html}
              className="mt-4 leading-relaxed text-muted-foreground"
            />

            <RichHtml
              as="div"
              content={content.storyParagraph2Html}
              className="mt-4 leading-relaxed text-muted-foreground"
            />

            {content.bulletPoints && content.bulletPoints.length > 0 && (
              <ul className="mt-6 flex flex-col gap-3">
                {content.bulletPoints.map((val, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-foreground">
                      {val}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <Button asChild>
                <Link href={content.btnLink || "#contact"}>
                  {content.btnText || "Learn More About Us"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
