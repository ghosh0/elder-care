'use server'

import { requireAdminSession, logAdminAction } from '@/lib/admin-auth'
import { AdminRole } from '@prisma/client'
import {
  LandingPageData,
  saveLandingPageData,
  resetLandingPageData,
} from '@/lib/landing-page-data'

export async function updateLandingPageAction(data: LandingPageData) {
  const { adminUser } = await requireAdminSession([
    AdminRole.SUPER_ADMIN,
    AdminRole.ADMIN,
    AdminRole.CONTENT_MANAGER,
  ])

  const result = await saveLandingPageData(data)

  if (result.success) {
    await logAdminAction({
      adminId: adminUser.id,
      action: 'UPDATE_LANDING_PAGE',
      entityType: 'LandingPageContent',
      entityId: 'default',
      metadata: {
        updatedBy: adminUser.name,
        timestamp: new Date().toISOString(),
      },
    })
  }

  return result
}

export async function resetLandingPageAction() {
  const { adminUser } = await requireAdminSession([
    AdminRole.SUPER_ADMIN,
    AdminRole.ADMIN,
  ])

  const result = await resetLandingPageData()

  if (result.success) {
    await logAdminAction({
      adminId: adminUser.id,
      action: 'RESET_LANDING_PAGE',
      entityType: 'LandingPageContent',
      entityId: 'default',
      metadata: {
        resetBy: adminUser.name,
        timestamp: new Date().toISOString(),
      },
    })
  }

  return result
}
