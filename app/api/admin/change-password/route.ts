import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from 'better-auth/crypto'
import { z } from 'zod'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters.').max(128),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input.' },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    // Get the credential account for this user
    const credAccount = await prisma.account.findFirst({
      where: { userId: session.user.id, providerId: 'credential' },
    })

    if (!credAccount?.password) {
      return NextResponse.json(
        { error: 'No password-based login found for your account. Please contact a super admin.' },
        { status: 400 }
      )
    }

    // Verify current password
    const isValid = await verifyPassword({
      hash: credAccount.password,
      password: currentPassword,
    })

    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from your current password.' },
        { status: 400 }
      )
    }

    const newHash = await hashPassword(newPassword)

    await prisma.account.update({
      where: { id: credAccount.id },
      data: { password: newHash },
    })

    // Log the action
    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        action: 'PASSWORD_CHANGED',
        entityType: 'User',
        entityId: session.user.id,
        metadata: { email: session.user.email, method: 'in-admin' } as any,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ChangePassword API] Error:', err)
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 })
  }
}
