import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { HowItWorks } from "@/components/how-it-works"
import { Stats } from "@/components/stats"
import { FAQ } from "@/components/faq"
import { BlogPreview } from "@/components/blog-preview"
import { ContactCta } from "@/components/contact-cta"
import { Footer } from "@/components/footer"
import { getLandingPageData } from "@/lib/landing-page-data"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const landingData = await getLandingPageData()

  return (
    <>
      <Navbar />
      <main>
        <Hero data={landingData.hero} />
        <About data={landingData.about} />
        <Services />
        <HowItWorks data={landingData.howItWorks} />
        <Stats stats={landingData.stats} />
        <FAQ data={landingData.faq} />
        <BlogPreview />
        <ContactCta data={landingData.contact} />
      </main>
      <Footer />
    </>
  )
}
