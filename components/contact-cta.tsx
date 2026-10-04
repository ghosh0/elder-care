"use client"

import { useState } from "react"
import { Send, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ContactSectionData, defaultLandingPageData } from "@/lib/landing-page-types"

interface ContactCtaProps {
  data?: ContactSectionData
}

export function ContactCta({ data = defaultLandingPageData.contact }: ContactCtaProps) {
  const content = data || defaultLandingPageData.contact
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contactCards = [
    {
      icon: Phone,
      label: "Call Us",
      value: content.phone || "9883608282 / 6290601110",
      href: `tel:${(content.phone || "").split("/")[0].trim()}`,
    },
    {
      icon: Mail,
      label: "Email Us",
      value: content.email || "ayushmanecs@gmail.com",
      href: `mailto:${content.email || "ayushmanecs@gmail.com"}`,
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: content.address || "Narendrapur Station Road",
      href: "#",
    },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim() || undefined,
      message: String(formData.get("message") || "").trim(),
      service: "General Consultation",
    }

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request.")
      }

      setSubmitted(true)
      form.reset()
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left side - info */}
          <div className="flex flex-1 flex-col">
            {content.badge && (
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                {content.badge}
              </span>
            )}
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
              {content.title || "Ready to Experience Our Services?"}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {content.subtitle ||
                "Let's start planning the best care for your loved ones. Reach out and we'll connect you with a care advisor."}
            </p>

            <div className="mt-8 flex flex-col gap-6">
              {contactCards.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="font-semibold text-foreground">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right side - form */}
          <div className="flex flex-1 flex-col">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-foreground">
                    Thank You!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {"We've received your message. A care advisor will reach out to you within 24 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Book a Free Consultation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in your details and we&apos;ll get back to you within 24 hours.
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="message">How can we help?</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your family member's care needs..."
                      rows={4}
                      required
                    />
                  </div>

                  {error ? (
                    <p className="text-sm text-destructive">{error}</p>
                  ) : null}

                  <Button type="submit" size="lg" disabled={submitting} className="mt-2 gap-2">
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending..." : "Request Consultation"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
