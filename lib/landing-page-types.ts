export interface HeroHighlight {
  label: string
  icon?: string
}

export interface HeroSectionData {
  badge: string
  titleHtml: string
  subtitleHtml: string
  primaryBtnText: string
  primaryBtnLink: string
  secondaryBtnText: string
  secondaryBtnLink: string
  image: string
  statNumber: string
  statLabel: string
  highlights: HeroHighlight[]
}

export interface AboutSectionData {
  badge: string
  titleHtml: string
  subtitleHtml: string
  image: string
  storyTitle: string
  storyParagraph1Html: string
  storyParagraph2Html: string
  bulletPoints: string[]
  btnText: string
  btnLink: string
}

export interface StatItem {
  value: number
  suffix: string
  label: string
  icon?: string
}

export interface HowItWorksStep {
  step: string
  title: string
  description: string
  icon?: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface ContactSectionData {
  badge: string
  title: string
  subtitle: string
  phone: string
  email: string
  address: string
}

export interface LandingPageData {
  hero: HeroSectionData
  about: AboutSectionData
  stats: StatItem[]
  howItWorks: {
    badge: string
    title: string
    subtitle: string
    steps: HowItWorksStep[]
  }
  faq: {
    badge: string
    title: string
    subtitle: string
    items: FaqItem[]
  }
  contact: ContactSectionData
}

export const defaultLandingPageData: LandingPageData = {
  hero: {
    badge: 'Trusted by 500+ Families Nationwide',
    titleHtml: 'Caring for Those Who <span class="text-primary font-bold">Cared for Us</span>',
    subtitleHtml:
      'We are your presence in your absence. Ayushman Elder Care Service provides premium elder care services including companionship, medical support, home nursing, and complete care management for your loved ones.',
    primaryBtnText: 'Get Started Today',
    primaryBtnLink: '/#contact',
    secondaryBtnText: 'Explore Our Services',
    secondaryBtnLink: '/#services',
    image: '/images/hero-elder-care.jpg',
    statNumber: '500+',
    statLabel: 'Happy Families',
    highlights: [
      { label: 'Trusted & Verified Caregivers', icon: 'Shield' },
      { label: '24/7 Emergency Support', icon: 'Clock' },
      { label: 'Compassionate Companionship', icon: 'Heart' },
    ],
  },
  about: {
    badge: 'About Us',
    titleHtml: 'Why Families Choose Ayushman Elder Care Service',
    subtitleHtml:
      'We are your presence in your absence. Founded with the mission to bridge the distance between families and their aging loved ones.',
    image: '/images/about-family.jpg',
    storyTitle: 'A Trusted Partner for Your Family',
    storyParagraph1Html:
      'What began as a vision to help families stay connected has grown into a trusted support system for over 500 families. We deliver love, support, and professional care to ensure your parents live with dignity, joy, and independence.',
    storyParagraph2Html:
      "Our team of dedicated caregivers acts as your family's local guardian, ensuring your loved ones are never alone in times of need. From accompanying them to doctor visits to simply sharing a moment of warmth, we are there every step of the way.",
    bulletPoints: [
      'Personalized care plans tailored to every individual',
      'Trained, verified, and compassionate caregivers',
      'Transparent communication with family members',
      '24/7 emergency medical support and ambulance',
      'Comprehensive well-being: physical, emotional & social',
    ],
    btnText: 'Learn More About Us',
    btnLink: '#contact',
  },
  stats: [
    { value: 500, suffix: '+', label: 'Happy Families', icon: 'Users' },
    { value: 50, suffix: '+', label: 'Trained Caregivers', icon: 'UserCheck' },
    { value: 60, suffix: '+', label: 'Partnered Doctors', icon: 'Stethoscope' },
    { value: 15, suffix: '+', label: 'Legal Experts', icon: 'Scale' },
  ],
  howItWorks: {
    badge: 'How It Works',
    title: 'Simple Steps to Peace of Mind',
    subtitle:
      'Getting started with Ayushman Elder Care Service is easy. Here is how we bring trusted care to your family.',
    steps: [
      {
        step: '01',
        title: 'Get in Touch',
        description:
          "Reach out to us via phone, email, or our contact form. Share your family's specific needs and concerns.",
        icon: 'PhoneCall',
      },
      {
        step: '02',
        title: 'Personalized Assessment',
        description:
          "Our team conducts a thorough assessment to understand your loved one's physical, emotional, and social needs.",
        icon: 'ClipboardCheck',
      },
      {
        step: '03',
        title: 'Matched with a Caregiver',
        description:
          "We assign a trained, verified caregiver who matches your parent's personality and care requirements.",
        icon: 'UserCheck',
      },
      {
        step: '04',
        title: 'Ongoing Care & Updates',
        description:
          'Regular visits, health monitoring, and transparent communication so you always know your parents are safe.',
        icon: 'HeartHandshake',
      },
    ],
  },
  faq: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle: "Can't find what you're looking for? Reach out and we'll be happy to help.",
    items: [
      {
        q: 'Do you provide emergency support any time of day?',
        a: 'Yes. Our Medical Exigency Support includes 24/7 emergency buddy assistance and ambulance coordination so your family can get immediate help during urgent situations.',
      },
      {
        q: 'Can you help with long-term treatment like dialysis or cancer care?',
        a: 'Yes. We support long-term treatment journeys including dialysis and cancer treatment coordination, hospital visit support, and continuity of care at home.',
      },
      {
        q: 'Do you offer palliative and emotional support at home?',
        a: 'Absolutely. We provide compassionate palliative support at home along with regular emotional support and monitoring to improve comfort and dignity.',
      },
      {
        q: 'Can you arrange medical equipment and home assistants?',
        a: 'Yes. We help arrange medical equipment on rent and coordinate trained home assistants based on your loved one’s condition and care plan.',
      },
      {
        q: 'Can you assist with Mediclaim, Aadhaar, PAN, and legal paperwork?',
        a: 'Yes. We provide practical support for Mediclaim workflows, Aadhaar/PAN documentation, and legal advisory needs so families can avoid delays and confusion.',
      },
      {
        q: 'Do you maintain records of each visit and care task?',
        a: 'Yes. We maintain service sheets for each visit, keep records updated, and share structured updates with family members for transparency and continuity.',
      },
      {
        q: 'Can you manage home logistics and special occasions?',
        a: 'Yes. We support relocation, home logistics, wage support for home staff, and special-occasion arrangements like birthdays and anniversaries.',
      },
      {
        q: 'Do you provide technology hand-holding for seniors?',
        a: 'Yes. We offer step-by-step technology troubleshooting help for calls, apps, digital payments, and basic device usage so seniors can stay connected and safe.',
      },
    ],
  },
  contact: {
    badge: 'Get in Touch',
    title: "Let's Discuss How We Can Support Your Family",
    subtitle:
      'Fill out the form below or reach us directly. Our care coordinator will respond within 24 hours.',
    phone: '9883608282 / 6290601110',
    email: 'ayushmanecs@gmail.com',
    address: 'Narendrapur Station Road',
  },
}

export function deepMerge(target: any, source: any): any {
  if (!source) return target
  if (typeof source !== 'object' || Array.isArray(source)) return source

  const output = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key]
    ) {
      output[key] = deepMerge(target[key], source[key])
    } else if (source[key] !== undefined) {
      output[key] = source[key]
    }
  }
  return output
}
