import { randomUUID } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import 'dotenv/config'
import { PrismaClient, AdminRole } from '@prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

const superAdminSeed = {
  name: 'Rajdip Ghosh',
  email: 'rajdipghosh24680@gmail.com',
  password: 'ChangeMe@12345',
  role: AdminRole.SUPER_ADMIN,
  isActive: true,
  emailVerified: true,
}

export async function main() {
  const passwordHash = await hashPassword(superAdminSeed.password)

  const existingUser = await prisma.user.findUnique({
    where: { email: superAdminSeed.email },
    select: { id: true },
  })

  const userId = existingUser?.id ?? randomUUID()

  await prisma.user.upsert({
    where: { email: superAdminSeed.email },
    create: {
      id: userId,
      name: superAdminSeed.name,
      email: superAdminSeed.email,
      role: superAdminSeed.role,
      isActive: superAdminSeed.isActive,
      emailVerified: superAdminSeed.emailVerified,
    },
    update: {
      name: superAdminSeed.name,
      role: superAdminSeed.role,
      isActive: superAdminSeed.isActive,
      emailVerified: superAdminSeed.emailVerified,
    },
  })

  const credentialAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: 'credential',
    },
    select: { id: true },
  })

  if (credentialAccount) {
    await prisma.account.update({
      where: { id: credentialAccount.id },
      data: {
        accountId: userId,
        password: passwordHash,
      },
    })
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: userId,
        providerId: 'credential',
        userId,
        password: passwordHash,
      },
    })
  }

  console.log(`Seeded SUPER_ADMIN: ${superAdminSeed.email}`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })