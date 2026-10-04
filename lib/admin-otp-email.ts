import nodemailer from 'nodemailer'

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) return null

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
  }
}

function getFromAddress() {
  const smtpConfig = getSmtpConfig()
  return process.env.SMTP_FROM?.trim() || smtpConfig?.auth.user || 'noreply@ayushmanecs.com'
}

/** Send a 6-digit OTP code to an admin for password reset */
export async function sendAdminOtpEmail(opts: {
  to: string
  recipientName: string
  otp: string
}): Promise<{ sent: boolean; reason?: string }> {
  const smtpConfig = getSmtpConfig()

  if (!smtpConfig) {
    console.warn('[OTP Email] SMTP not configured — logging OTP to console for dev.')
    console.log(`[DEV] OTP for ${opts.to}: ${opts.otp}`)
    return { sent: false, reason: 'smtp-not-configured' }
  }

  const transporter = nodemailer.createTransport(smtpConfig)
  const from = getFromAddress()

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background:#f1f5f9;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <!-- Logo/Brand header -->
        <tr>
          <td style="background:#1e293b;border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
            <div style="display:inline-block;background:#ffffff22;border-radius:10px;padding:8px 16px;">
              <span style="color:#ffffff;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Ayushman Elder Care</span>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">Admin Portal — Security Verification</p>
          </td>
        </tr>

        <!-- Main card -->
        <tr>
          <td style="background:#ffffff;padding:40px 36px;">
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Password Reset Request</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.6;">
              Hi <strong>${opts.recipientName}</strong>, we received a request to reset your admin password.
              Use the verification code below. It expires in <strong>15 minutes</strong>.
            </p>

            <!-- OTP Box -->
            <div style="background:#f8fafc;border:2px dashed #e2e8f0;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
              <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Your Verification Code</p>
              <div style="font-size:42px;font-weight:800;letter-spacing:12px;color:#1e293b;font-family:'Courier New',monospace;">${opts.otp}</div>
            </div>

            <!-- Security notice -->
            <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;padding:12px 16px;margin:0 0 24px;">
              <p style="margin:0;color:#92400e;font-size:13px;">
                <strong>⚠ Security notice:</strong> If you did not request this, please ignore this email. Your password will not change.
              </p>
            </div>

            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
              This code is valid for a single use only and expires after 15 minutes. Do not share this code with anyone.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 36px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              Ayushman Elder Care Service · Admin Portal · This is an automated security email.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `
Password Reset Verification Code
=================================

Hi ${opts.recipientName},

Your admin password reset OTP is: ${opts.otp}

This code expires in 15 minutes and is valid for one-time use only.

If you did not request this, please ignore this email.

— Ayushman Elder Care Service, Admin Portal
`.trim()

  try {
    await transporter.sendMail({
      from: `"Ayushman Admin Portal" <${from}>`,
      to: opts.to,
      subject: `[Admin] Password Reset Code: ${opts.otp}`,
      text,
      html,
    })
    return { sent: true }
  } catch (err) {
    console.error('[OTP Email] Failed to send:', err)
    return { sent: false, reason: String(err) }
  }
}
