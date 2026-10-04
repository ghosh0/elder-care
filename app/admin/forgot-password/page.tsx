'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'

type Step = 'email' | 'otp' | 'success'

export default function AdminForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCountdown, setResendCountdown] = useState(0)

  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCountdown])

  // === Step 1: Send OTP ===
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to send verification code.')
      } else {
        setStep('otp')
        setResendCountdown(60)
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // === Step 2: Resend OTP ===
  async function handleResend() {
    if (resendCountdown > 0) return
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to resend code.')
      } else {
        setOtp(['', '', '', '', '', ''])
        setResendCountdown(60)
        otpRefs.current[0]?.focus()
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  // === OTP input handling ===
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    const next = ['', '', '', '', '', '']
    digits.forEach((d, i) => { next[i] = d })
    setOtp(next)
    const focusIdx = Math.min(digits.length, 5)
    otpRefs.current[focusIdx]?.focus()
  }

  // === Step 2 + 3 combined: Verify OTP & reset password ===
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const otpCode = otp.join('')
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to reset password.')
      } else {
        setStep('success')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = (() => {
    if (!newPassword) return null
    let score = 0
    if (newPassword.length >= 8) score++
    if (newPassword.length >= 12) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++
    if (score <= 2) return { label: 'Weak', color: 'bg-destructive', width: '33%' }
    if (score <= 3) return { label: 'Fair', color: 'bg-amber-500', width: '55%' }
    if (score === 4) return { label: 'Good', color: 'bg-emerald-500', width: '78%' }
    return { label: 'Strong', color: 'bg-emerald-600', width: '100%' }
  })()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 bg-secondary/40" />
      <div className="pointer-events-none absolute -top-16 -left-12 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur-sm overflow-hidden">

        {/* === SUCCESS STATE === */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-6 p-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Password Updated!</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your admin password has been reset successfully. All previous sessions have been signed out for security.
                Please sign in with your new password.
              </p>
            </div>
            <Button className="w-full gap-2" onClick={() => router.push('/admin/login')}>
              <KeyRound className="h-4 w-4" />
              Sign In with New Password
            </Button>
          </div>
        )}

        {/* === STEP 1: Email === */}
        {step === 'email' && (
          <div className="p-8">
            <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Admin Portal
                </span>
                <h1 className="font-serif text-2xl font-bold text-foreground">Forgot Password</h1>
              </div>
            </div>

            <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
              Enter the email address linked to your admin account. We&apos;ll send you a 6-digit verification code valid for <strong>15 minutes</strong>.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email Address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Remembered your password?{' '}
                <Link href="/admin/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        )}

        {/* === STEP 2: OTP + New Password === */}
        {step === 'otp' && (
          <div className="p-8">
            <button
              type="button"
              onClick={() => { setStep('email'); setError(null); setOtp(['', '', '', '', '', '']) }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change Email
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Verify Identity
                </span>
                <h1 className="font-serif text-2xl font-bold text-foreground">Enter Code & New Password</h1>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                A 6-digit code was sent to{' '}
                <span className="font-semibold text-foreground">{email}</span>
                <br />
                <span className="text-xs">Check your inbox and spam folder. Code expires in 15 minutes.</span>
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP input grid */}
              <div className="space-y-2">
                <Label>Verification Code</Label>
                <div className="flex gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className={`h-12 w-full rounded-xl border text-center text-xl font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        digit ? 'border-primary bg-primary/5' : 'border-border bg-background'
                      }`}
                      aria-label={`OTP digit ${idx + 1}`}
                      id={`otp-${idx}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || loading}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : 'Resend code'}
                </button>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Strength meter */}
                {passwordStrength && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                      {passwordStrength.label === 'Weak' && ' — Add uppercase, numbers, symbols'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 ${
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-destructive focus-visible:ring-destructive/20'
                        : confirmPassword && confirmPassword === newPassword
                        ? 'border-emerald-500 focus-visible:ring-emerald-500/20'
                        : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Passwords match
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || otp.join('').length < 6 || !newPassword || newPassword !== confirmPassword}
                className="w-full gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? 'Resetting Password...' : 'Verify & Reset Password'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
