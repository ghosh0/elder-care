import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { prisma } from '../lib/prisma'
import { AdminRole } from '@prisma/client'

async function main() {
  const email = process.argv[2]?.trim().toLowerCase() || 'rajdipghosh24680@gmail.com'
  const newPassword = process.argv[3]?.trim() || 'Admin@12345'

  console.log(`\n========================================`)
  console.log(`🔐 EMERGENCY ADMIN PASSWORD RESET UTILITY`)
  console.log(`========================================`)
  console.log(`Target Email: ${email}`)

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  })

  if (!user) {
    console.error(`\n❌ Error: No user found with email: ${email}`)
    console.log(`Registered users in database:`)
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    })
    console.table(allUsers)
    process.exit(1)
  }

  console.log(`Found user: ${user.name} (${user.role}) [ID: ${user.id}]`)

  const passwordHash = await hashPassword(newPassword)

  // Find or create credential account
  const credentialAccount = user.accounts.find(
    (acc) => acc.providerId === 'credential'
  )

  if (credentialAccount) {
    await prisma.account.update({
      where: { id: credentialAccount.id },
      data: { password: passwordHash },
    })
    console.log(`✅ Updated existing credential account password.`)
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        userId: user.id,
        providerId: 'credential',
        password: passwordHash,
      },
    })
    console.log(`✅ Created credential account with new password.`)
  }

  // Ensure user is active and has Super Admin role
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      role: user.role === AdminRole.SUPER_ADMIN ? AdminRole.SUPER_ADMIN : user.role,
    },
  })

  console.log(`\n🎉 Password successfully reset!`)
  console.log(`----------------------------------------`)
  console.log(`Email:    ${email}`)
  console.log(`Password: ${newPassword}`)
  console.log(`Role:     ${user.role}`)
  console.log(`URL:      http://localhost:3000/admin/login`)
  console.log(`----------------------------------------\n`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error during password reset:', err)
  process.exit(1)
})
