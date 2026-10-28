import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { prisma } from '../lib/prisma'
import { AdminRole } from '@prisma/client'

async function main() {
  const email = 'ayushmanecs@gmail.com'
  const password = 'ElderCare8x07@26'
  const name = 'Ayushman Super Admin'
  const role = AdminRole.SUPER_ADMIN

  console.log(`\n========================================`)
  console.log(`🌱 SEEDING NEW SUPER ADMIN`)
  console.log(`========================================`)
  console.log(`Email: ${email}`)

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`⚠️  User already exists (ID: ${existing.id}). Updating password and ensuring SUPER_ADMIN role...`)

    const passwordHash = await hashPassword(password)
    const credAccount = await prisma.account.findFirst({
      where: { userId: existing.id, providerId: 'credential' },
    })

    if (credAccount) {
      await prisma.account.update({
        where: { id: credAccount.id },
        data: { password: passwordHash },
      })
    } else {
      await prisma.account.create({
        data: {
          id: randomUUID(),
          accountId: existing.id,
          userId: existing.id,
          providerId: 'credential',
          password: passwordHash,
        },
      })
    }

    await prisma.user.update({
      where: { id: existing.id },
      data: { role: AdminRole.SUPER_ADMIN, isActive: true },
    })

    console.log(`✅ Updated existing user to SUPER_ADMIN with new password.`)
  } else {
    const passwordHash = await hashPassword(password)
    const userId = randomUUID()

    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: true,
        role,
        isActive: true,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: userId,
            providerId: 'credential',
            password: passwordHash,
          },
        },
      },
    })

    console.log(`✅ Created new SUPER_ADMIN user.`)
  }

  console.log(`\n🎉 Done!`)
  console.log(`----------------------------------------`)
  console.log(`Email:    ${email}`)
  console.log(`Password: ${password}`)
  console.log(`Role:     SUPER_ADMIN`)
  console.log(`----------------------------------------\n`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error during seed:', err)
  process.exit(1)
})
