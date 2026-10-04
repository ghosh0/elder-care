import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { LandingPageData, defaultLandingPageData } from "@/lib/landing-page-data"

interface FAQProps {
  data?: LandingPageData['faq']
}

export function FAQ({ data = defaultLandingPageData.faq }: FAQProps) {
  const content = data || defaultLandingPageData.faq

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        {/* Heading */}
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
          <p className="mx-auto mt-4 max-w-xl text-pretty text-center text-lg leading-relaxed text-muted-foreground">
            {content.subtitle}
          </p>
        )}

        {/* Accordion */}
        <Accordion type="single" collapsible className="mt-12">
          {content.items.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="#contact">Still Have Questions? Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
