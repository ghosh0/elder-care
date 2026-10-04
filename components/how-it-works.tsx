import { PhoneCall, ClipboardCheck, UserCheck, HeartHandshake } from "lucide-react"
import { LandingPageData, defaultLandingPageData } from "@/lib/landing-page-data"

const defaultIcons = [PhoneCall, ClipboardCheck, UserCheck, HeartHandshake]

interface HowItWorksProps {
  data?: LandingPageData['howItWorks']
}

export function HowItWorks({ data = defaultLandingPageData.howItWorks }: HowItWorksProps) {
  const content = data || defaultLandingPageData.howItWorks

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        {content.badge && (
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              {content.badge}
            </span>
          </div>
        )}

        <h2 className="text-balance text-center font-serif text-3xl font-bold text-foreground md:text-4xl">
          {content.title}
        </h2>

        {content.subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-center text-lg leading-relaxed text-muted-foreground">
            {content.subtitle}
          </p>
        )}

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute top-12 right-0 left-0 hidden h-px bg-border lg:block" />

          {content.steps.map((item, idx) => {
            const Icon = defaultIcons[idx % defaultIcons.length]
            return (
              <div key={item.step || idx} className="relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-primary bg-card shadow-md">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">
                  Step {item.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
