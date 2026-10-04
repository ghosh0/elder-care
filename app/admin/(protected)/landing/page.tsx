import { requireAdminSession } from '@/lib/admin-auth'
import { AdminRole } from '@prisma/client'
import { getLandingPageData } from '@/lib/landing-page-data'
import { LandingEditorForm } from './landing-editor-form'

export default async function AdminLandingPage() {
  await requireAdminSession([
    AdminRole.SUPER_ADMIN,
    AdminRole.ADMIN,
    AdminRole.CONTENT_MANAGER,
    AdminRole.COORDINATOR,
  ])

  const landingData = await getLandingPageData()

  return (
    <main className="space-y-6">
      <LandingEditorForm initialData={landingData} />
    </main>
  )
}
