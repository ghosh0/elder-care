import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminRole } from '@prisma/client'

export const inquiryViewRoles: AdminRole[] = [
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMIN,
  AdminRole.COORDINATOR,
  AdminRole.SUPPORT,
]

export const inquiryManageRoles: AdminRole[] = [
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMIN,
  AdminRole.COORDINATOR,
]

export const blogManageRoles: AdminRole[] = [
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMIN,
  AdminRole.CONTENT_MANAGER,
]

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireAdminSession(allowedRoles?: AdminRole[]) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    redirect('/admin/login')
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  })

  if (!adminUser || !adminUser.isActive) {
    redirect('/admin/unauthorized')
  }

  if (allowedRoles && !allowedRoles.includes(adminUser.role)) {
    redirect('/admin/unauthorized')
  }

  return {
    session,
    adminUser,
  }
}

export async function requireSuperAdminSession() {
  return requireAdminSession([AdminRole.SUPER_ADMIN])
}

export async function requireInquiryViewSession() {
  return requireAdminSession(inquiryViewRoles)
}

export async function requireInquiryManageSession() {
  return requireAdminSession(inquiryManageRoles)
}

export async function requireBlogManageSession() {
  return requireAdminSession(blogManageRoles)
}

export async function logAdminAction(input: {
  adminId: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Record<string, unknown>
}) {
  await prisma.adminActionLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata as any,
    },
  })
}
