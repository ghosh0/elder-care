"use client"

import { useEffect, useState, useRef } from "react"
import { Users, UserCheck, Stethoscope, Scale } from "lucide-react"
import { StatItem, defaultLandingPageData } from "@/lib/landing-page-types"

const defaultIcons = [Users, UserCheck, Stethoscope, Scale]

function AnimatedCounter({
  target,
  suffix,
}: {
  target: number
  suffix: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 2000
          const increment = target / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

interface StatsProps {
  stats?: StatItem[]
}

export function Stats({ stats = defaultLandingPageData.stats }: StatsProps) {
  const items = stats || defaultLandingPageData.stats

  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat, idx) => {
            const Icon = defaultIcons[idx % defaultIcons.length]
            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="mt-4 font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm font-medium text-primary-foreground/70">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
