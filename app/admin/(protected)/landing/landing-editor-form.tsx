'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  LandingPageData,
  defaultLandingPageData,
} from '@/lib/landing-page-types'
import { updateLandingPageAction, resetLandingPageAction } from './actions'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { ImagePicker } from '@/components/admin/image-picker'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sparkles,
  UserCheck,
  TrendingUp,
  HelpCircle,
  PhoneCall,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Workflow,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'

interface LandingEditorFormProps {
  initialData: LandingPageData
}

type TabKey = 'hero' | 'about' | 'stats' | 'howItWorks' | 'faq' | 'contact'

export function LandingEditorForm({ initialData }: LandingEditorFormProps) {
  const [data, setData] = useState<LandingPageData>(initialData)
  const [activeTab, setActiveTab] = useState<TabKey>('hero')
  const [isPending, startTransition] = useTransition()
  const [isResetting, startResetTransition] = useTransition()

  // Hero Section updates
  function updateHero<K extends keyof LandingPageData['hero']>(
    field: K,
    val: LandingPageData['hero'][K]
  ) {
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val,
      },
    }))
  }

  function updateHeroHighlight(index: number, label: string) {
    setData((prev) => {
      const nextHighlights = [...prev.hero.highlights]
      nextHighlights[index] = { ...nextHighlights[index], label }
      return {
        ...prev,
        hero: {
          ...prev.hero,
          highlights: nextHighlights,
        },
      }
    })
  }

  // About Section updates
  function updateAbout<K extends keyof LandingPageData['about']>(
    field: K,
    val: LandingPageData['about'][K]
  ) {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: val,
      },
    }))
  }

  function updateAboutBullet(index: number, val: string) {
    setData((prev) => {
      const nextBullets = [...prev.about.bulletPoints]
      nextBullets[index] = val
      return {
        ...prev,
        about: {
          ...prev.about,
          bulletPoints: nextBullets,
        },
      }
    })
  }

  function addAboutBullet() {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        bulletPoints: [...prev.about.bulletPoints, 'New care service highlight'],
      },
    }))
  }

  function removeAboutBullet(index: number) {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        bulletPoints: prev.about.bulletPoints.filter((_, i) => i !== index),
      },
    }))
  }

  // Stats updates
  function updateStat(
    index: number,
    field: 'value' | 'suffix' | 'label',
    val: string | number
  ) {
    setData((prev) => {
      const nextStats = [...prev.stats]
      nextStats[index] = {
        ...nextStats[index],
        [field]: field === 'value' ? Number(val) || 0 : val,
      }
      return {
        ...prev,
        stats: nextStats,
      }
    })
  }

  // How It Works updates
  function updateHowItWorks<K extends keyof LandingPageData['howItWorks']>(
    field: K,
    val: LandingPageData['howItWorks'][K]
  ) {
    setData((prev) => ({
      ...prev,
      howItWorks: {
        ...prev.howItWorks,
        [field]: val,
      },
    }))
  }

  function updateStep(
    index: number,
    field: 'step' | 'title' | 'description',
    val: string
  ) {
    setData((prev) => {
      const nextSteps = [...prev.howItWorks.steps]
      nextSteps[index] = {
        ...nextSteps[index],
        [field]: val,
      }
      return {
        ...prev,
        howItWorks: {
          ...prev.howItWorks,
          steps: nextSteps,
        },
      }
    })
  }

  // FAQ updates
  function updateFaq<K extends keyof LandingPageData['faq']>(
    field: K,
    val: LandingPageData['faq'][K]
  ) {
    setData((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        [field]: val,
      },
    }))
  }

  function updateFaqItem(index: number, field: 'q' | 'a', val: string) {
    setData((prev) => {
      const nextItems = [...prev.faq.items]
      nextItems[index] = {
        ...nextItems[index],
        [field]: val,
      }
      return {
        ...prev,
        faq: {
          ...prev.faq,
          items: nextItems,
        },
      }
    })
  }

  function addFaqItem() {
    setData((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: [
          ...prev.faq.items,
          { q: 'New Frequently Asked Question', a: 'Detailed answer here...' },
        ],
      },
    }))
  }

  function removeFaqItem(index: number) {
    setData((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.filter((_, i) => i !== index),
      },
    }))
  }

  // Contact updates
  function updateContact<K extends keyof LandingPageData['contact']>(
    field: K,
    val: LandingPageData['contact'][K]
  ) {
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val,
      },
    }))
  }

  // Save handler
  function handleSave() {
    startTransition(async () => {
      const res = await updateLandingPageAction(data)
      if (res.success) {
        toast.success('Landing page updated and published live!')
      } else {
        toast.error(res.error || 'Failed to update landing page')
      }
    })
  }

  // Reset handler
  function handleReset() {
    if (
      !window.confirm(
        'Are you sure you want to reset all landing page content to default? Any custom edits will be lost.'
      )
    ) {
      return
    }

    startResetTransition(async () => {
      const res = await resetLandingPageAction()
      if (res.success) {
        setData(defaultLandingPageData)
        toast.success('Landing page reset to default content!')
      } else {
        toast.error('Failed to reset content')
      }
    })
  }

  const tabs: Array<{ id: TabKey; label: string; icon: React.ElementType }> = [
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'about', label: 'About Us', icon: UserCheck },
    { id: 'stats', label: 'Stats Counters', icon: TrendingUp },
    { id: 'howItWorks', label: 'How It Works', icon: Workflow },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'contact', label: 'Contact & Info', icon: PhoneCall },
  ]

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Site Customizer
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">
            Landing Page Editor
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize all texts, rich formatting (bold, fonts, sizes, highlights), images, and sections in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4" />
              View Live Site
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isResetting || isPending}
            onClick={handleReset}
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            Reset Defaults
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleSave}
            className="gap-2 shadow-sm"
          >
            <Save className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            {isPending ? 'Saving...' : 'Save & Publish'}
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-1.5 shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: HERO */}
      {activeTab === 'hero' && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="border-b border-border pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">Hero Section</h3>
              <p className="text-xs text-muted-foreground">
                First impression of your website. Features the main headline, description, call to action buttons, and hero image.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-badge">Header Pill / Trust Badge</Label>
                <Input
                  id="hero-badge"
                  value={data.hero.badge}
                  onChange={(e) => updateHero('badge', e.target.value)}
                  placeholder="e.g. Trusted by 500+ Families Nationwide"
                />
              </div>

              {/* Headline with Rich Text */}
              <RichTextEditor
                label="Main Headline (Supports Bold, Font Size, Font Family, Underline, Italics, Highlight, & Brand Accent)"
                description="Highlight words and use the toolbar to format. Click 'Brand Accent' to give selected words the signature brand color."
                value={data.hero.titleHtml}
                onChange={(html) => updateHero('titleHtml', html)}
                rows={3}
              />

              {/* Subtitle with Rich Text */}
              <RichTextEditor
                label="Hero Subtitle / Description"
                description="Describe your core mission and service offerings with rich formatting."
                value={data.hero.subtitleHtml}
                onChange={(html) => updateHero('subtitleHtml', html)}
                rows={4}
              />

              {/* Hero Image Selection */}
              <ImagePicker
                label="Hero Showcase Image"
                description="Select an image from the library, upload your own photo, or enter an external image URL."
                value={data.hero.image}
                onChange={(url) => updateHero('image', url)}
              />

              {/* CTA Buttons */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="hero-pbtn">Primary Button Text</Label>
                  <Input
                    id="hero-pbtn"
                    value={data.hero.primaryBtnText}
                    onChange={(e) => updateHero('primaryBtnText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-plink">Primary Button Link</Label>
                  <Input
                    id="hero-plink"
                    value={data.hero.primaryBtnLink}
                    onChange={(e) => updateHero('primaryBtnLink', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-sbtn">Secondary Button Text</Label>
                  <Input
                    id="hero-sbtn"
                    value={data.hero.secondaryBtnText}
                    onChange={(e) => updateHero('secondaryBtnText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-slink">Secondary Button Link</Label>
                  <Input
                    id="hero-slink"
                    value={data.hero.secondaryBtnLink}
                    onChange={(e) => updateHero('secondaryBtnLink', e.target.value)}
                  />
                </div>
              </div>

              {/* Floating Stat Card */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Floating Image Badge</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="stat-num">Counter Value</Label>
                    <Input
                      id="stat-num"
                      value={data.hero.statNumber}
                      onChange={(e) => updateHero('statNumber', e.target.value)}
                      placeholder="500+"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stat-lbl">Counter Label</Label>
                    <Input
                      id="stat-lbl"
                      value={data.hero.statLabel}
                      onChange={(e) => updateHero('statLabel', e.target.value)}
                      placeholder="Happy Families"
                    />
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <Label>Trust Highlights (3 items under buttons)</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {data.hero.highlights.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[11px] font-mono text-muted-foreground">Badge {idx + 1}</span>
                      <Input
                        value={item.label}
                        onChange={(e) => updateHeroHighlight(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: ABOUT US */}
      {activeTab === 'about' && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="border-b border-border pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">About Us Section</h3>
              <p className="text-xs text-muted-foreground">
                Explain your company background, story, and why families trust your caregivers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-badge">Section Tag</Label>
                <Input
                  id="about-badge"
                  value={data.about.badge}
                  onChange={(e) => updateAbout('badge', e.target.value)}
                />
              </div>

              <RichTextEditor
                label="About Heading"
                value={data.about.titleHtml}
                onChange={(html) => updateAbout('titleHtml', html)}
                rows={2}
              />

              <RichTextEditor
                label="About Subtitle"
                value={data.about.subtitleHtml}
                onChange={(html) => updateAbout('subtitleHtml', html)}
                rows={3}
              />

              {/* About Image Selection */}
              <ImagePicker
                label="About Story Image"
                description="Visual image depicting care, family, or your team."
                value={data.about.image}
                onChange={(url) => updateAbout('image', url)}
              />

              <div className="space-y-2">
                <Label htmlFor="about-stitle">Story Title</Label>
                <Input
                  id="about-stitle"
                  value={data.about.storyTitle}
                  onChange={(e) => updateAbout('storyTitle', e.target.value)}
                />
              </div>

              <RichTextEditor
                label="Story Paragraph 1"
                value={data.about.storyParagraph1Html}
                onChange={(html) => updateAbout('storyParagraph1Html', html)}
                rows={3}
              />

              <RichTextEditor
                label="Story Paragraph 2"
                value={data.about.storyParagraph2Html}
                onChange={(html) => updateAbout('storyParagraph2Html', html)}
                rows={3}
              />

              {/* Bullet Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Key Value Checklist Points</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAboutBullet}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Point
                  </Button>
                </div>

                <div className="space-y-2">
                  {data.about.bulletPoints.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <Input
                        value={point}
                        onChange={(e) => updateAboutBullet(idx, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAboutBullet(idx)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="about-btn-t">Button Text</Label>
                  <Input
                    id="about-btn-t"
                    value={data.about.btnText}
                    onChange={(e) => updateAbout('btnText', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-btn-l">Button Link</Label>
                  <Input
                    id="about-btn-l"
                    value={data.about.btnLink}
                    onChange={(e) => updateAbout('btnLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: STATS */}
      {activeTab === 'stats' && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="border-b border-border pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">Stats Banner</h3>
              <p className="text-xs text-muted-foreground">
                High-impact counters displayed in the primary accent banner across the landing page.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {data.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-primary">
                      Counter #{idx + 1}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      Preview: {stat.value}
                      {stat.suffix}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Target Number</Label>
                      <Input
                        type="number"
                        value={stat.value}
                        onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Suffix (e.g. +)</Label>
                      <Input
                        value={stat.suffix}
                        onChange={(e) => updateStat(idx, 'suffix', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Label Description</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: HOW IT WORKS */}
      {activeTab === 'howItWorks' && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="border-b border-border pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">How It Works Section</h3>
              <p className="text-xs text-muted-foreground">
                Guide families step-by-step through contacting, assessing, matching, and ongoing care.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Input
                    value={data.howItWorks.badge}
                    onChange={(e) => updateHowItWorks('badge', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={data.howItWorks.title}
                    onChange={(e) => updateHowItWorks('title', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={data.howItWorks.subtitle}
                  onChange={(e) => updateHowItWorks('subtitle', e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {data.howItWorks.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">Step {st.step}</span>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Step Title</Label>
                      <Input
                        value={st.title}
                        onChange={(e) => updateStep(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <textarea
                        value={st.description}
                        rows={3}
                        onChange={(e) => updateStep(idx, 'description', e.target.value)}
                        className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: FAQ */}
      {activeTab === 'faq' && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Frequently Asked Questions</h3>
                <p className="text-xs text-muted-foreground">
                  Add, edit, or remove questions and answers displayed in the interactive accordion.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFaqItem}
                className="gap-1.5 text-xs shrink-0"
              >
                <Plus className="h-4 w-4 text-primary" />
                Add New Question
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={data.faq.title}
                  onChange={(e) => updateFaq('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input
                  value={data.faq.subtitle}
                  onChange={(e) => updateFaq('subtitle', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {data.faq.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Q#{idx + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaqItem(idx)}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Question</Label>
                    <Input
                      value={item.q}
                      onChange={(e) => updateFaqItem(idx, 'q', e.target.value)}
                      placeholder="e.g. Do you provide 24/7 care?"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Answer</Label>
                    <textarea
                      value={item.a}
                      rows={3}
                      onChange={(e) => updateFaqItem(idx, 'a', e.target.value)}
                      placeholder="Write answer details..."
                      className="w-full rounded-md border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 6: CONTACT & INFO */}
      {activeTab === 'contact' && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="border-b border-border pb-3">
              <h3 className="font-serif text-xl font-bold text-foreground">Contact & Consultation Banner</h3>
              <p className="text-xs text-muted-foreground">
                Phone numbers, email addresses, and consultation headline shown in the contact section.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Section Badge</Label>
                <Input
                  value={data.contact.badge}
                  onChange={(e) => updateContact('badge', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Consultation Section Headline</Label>
                <Input
                  value={data.contact.title}
                  onChange={(e) => updateContact('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={data.contact.subtitle}
                  onChange={(e) => updateContact('subtitle', e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="space-y-2">
                  <Label>Phone Number(s)</Label>
                  <Input
                    value={data.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    placeholder="9883608282 / 6290601110"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={data.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    placeholder="ayushmanecs@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Physical Office Address</Label>
                  <Input
                    value={data.contact.address}
                    onChange={(e) => updateContact('address', e.target.value)}
                    placeholder="Narendrapur Station Road"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Save Actions Bar at bottom */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-border bg-card/90 px-6 py-3.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="h-4 w-4 text-primary" />
          <span>Edits are published immediately to the live landing page upon saving.</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isResetting || isPending}
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleSave}
            className="gap-2 px-5 font-semibold"
          >
            <Save className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            {isPending ? 'Publishing...' : 'Save & Publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}
