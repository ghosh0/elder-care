import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RichHtml } from "@/components/ui/rich-html"
import { HeroSectionData, defaultLandingPageData } from "@/lib/landing-page-data"

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Clock,
  Heart,
}

interface HeroProps {
  data?: HeroSectionData
}

export function Hero({ data = defaultLandingPageData.hero }: HeroProps) {
  const content = data || defaultLandingPageData.hero

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24"
    >
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-secondary/40" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:gap-16">
        {/* Text content */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          {content.badge && (
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {content.badge}
            </span>
          )}

          <RichHtml
            as="h1"
            content={content.titleHtml}
            className="text-balance font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
          />

          <RichHtml
            as="div"
            content={content.subtitleHtml}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          />

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href={content.primaryBtnLink || "/#contact"}>
                {content.primaryBtnText || "Get Started Today"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {content.secondaryBtnText && (
              <Button size="lg" variant="outline" asChild>
                <Link href={content.secondaryBtnLink || "/#services"}>
                  {content.secondaryBtnText}
                </Link>
              </Button>
            )}
          </div>

          {/* Trust badges */}
          {content.highlights && content.highlights.length > 0 && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8">
              {content.highlights.map((item, idx) => {
                const IconComponent = (item.icon && iconMap[item.icon]) || Shield
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <IconComponent className="h-5 w-5 text-primary" />
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Hero image */}
        <div className="relative flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            {content.image ? (
              <Image
                src={content.image}
                alt="Caregiver spending quality time with an elderly person"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={content.image.startsWith('http')}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No hero image set
              </div>
            )}
          </div>
          {/* Floating card */}
          {content.statNumber && (
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card p-4 shadow-lg md:-bottom-6 md:-left-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{content.statNumber}</p>
                  <p className="text-sm text-muted-foreground">{content.statLabel}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
