import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'node:crypto'
import { createHash } from 'node:crypto'
import { prisma } from '@/lib/prisma'
import { sendAdminOtpEmail } from '@/lib/admin-otp-email'

function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Look up admin user — do NOT reveal whether email exists (security)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, isActive: true },
    })

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      // Silently succeed — don't reveal non-existence
      return NextResponse.json({ success: true })
    }

    // Invalidate any existing unused OTPs for this email
    await (prisma as any).adminPasswordReset.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    // Generate 6-digit OTP
    const otp = String(randomInt(100000, 999999))
    const otpHash = hashOtp(otp)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await (prisma as any).adminPasswordReset.create({
      data: {
        email,
        otpHash,
        expiresAt,
      },
    })

    // Send email
    const result = await sendAdminOtpEmail({
      to: email,
      recipientName: user.name,
      otp,
    })

    if (!result.sent) {
      console.warn('[ForgotPassword] OTP email not sent — SMTP may not be configured. OTP logged to server console.')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ForgotPassword API] Error:', err)
    return NextResponse.json({ error: 'An internal error occurred. Please try again.' }, { status: 500 })
  }
}
