import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  LandingPageData,
  defaultLandingPageData,
  deepMerge,
} from './landing-page-types'

export * from './landing-page-types'

export async function getLandingPageData(): Promise<LandingPageData> {
  try {
    const record = await (prisma as any).landingPageContent.findUnique({
      where: { id: 'default' },
    })

    if (!record || !record.data) {
      return defaultLandingPageData
    }

    return deepMerge(defaultLandingPageData, record.data)
  } catch (error) {
    console.error('Failed to load landing page data, falling back to defaults:', error)
    return defaultLandingPageData
  }
}

export async function saveLandingPageData(data: LandingPageData): Promise<{ success: boolean; error?: string }> {
  try {
    await (prisma as any).landingPageContent.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        data: data as any,
      },
      update: {
        data: data as any,
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/landing')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to save landing page content:', error)
    return { success: false, error: error?.message || 'Failed to save landing page content' }
  }
}

export async function resetLandingPageData(): Promise<{ success: boolean }> {
  try {
    await (prisma as any).landingPageContent.delete({
      where: { id: 'default' },
    }).catch(() => null)

    revalidatePath('/')
    revalidatePath('/admin/landing')
    return { success: true }
  } catch (error) {
    console.error('Failed to reset landing page data:', error)
    return { success: false }
  }
}
