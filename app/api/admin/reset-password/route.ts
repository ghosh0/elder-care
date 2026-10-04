import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { hashPassword } from 'better-auth/crypto'
import { z } from 'zod'

function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex')
}

const schema = z.object({
  email: z.string().trim().email(),
  otp: z.string().trim().length(6),
  newPassword: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input.' },
        { status: 400 }
      )
    }

    const { email, otp, newPassword } = parsed.data
    const lowerEmail = email.toLowerCase()
    const otpHash = hashOtp(otp)

    // Find a valid, unused OTP record
    const resetRecord = await (prisma as any).adminPasswordReset.findFirst({
      where: {
        email: lowerEmail,
        otpHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new one.' },
        { status: 400 }
      )
    }

    // Mark OTP as used immediately (prevent replay attacks)
    await (prisma as any).adminPasswordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    })

    // Find the admin user
    const user = await prisma.user.findUnique({
      where: { email: lowerEmail },
      include: { accounts: { where: { providerId: 'credential' } } },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Account not found or inactive.' }, { status: 404 })
    }

    const newPasswordHash = await hashPassword(newPassword)

    const credentialAccount = user.accounts[0]

    if (credentialAccount) {
      await prisma.account.update({
        where: { id: credentialAccount.id },
        data: { password: newPasswordHash },
      })
    } else {
      // Create credential account if it somehow doesn't exist
      const { randomUUID } = await import('node:crypto')
      await prisma.account.create({
        data: {
          id: randomUUID(),
          accountId: user.id,
          userId: user.id,
          providerId: 'credential',
          password: newPasswordHash,
        },
      })
    }

    // Invalidate ALL existing sessions for this user (force re-login everywhere)
    await prisma.session.deleteMany({ where: { userId: user.id } })

    // Log the action
    await prisma.adminActionLog.create({
      data: {
        adminId: user.id,
        action: 'PASSWORD_RESET_VIA_OTP',
        entityType: 'User',
        entityId: user.id,
        metadata: { email: user.email, method: 'otp' } as any,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ResetPassword API] Error:', err)
    return NextResponse.json({ error: 'An internal error occurred. Please try again.' }, { status: 500 })
  }
}
