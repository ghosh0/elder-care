import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { AdminRole } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    await requireAdminSession([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.CONTENT_MANAGER,
      AdminRole.COORDINATOR,
      AdminRole.SUPPORT,
    ])

    const images: Array<{ name: string; url: string; category: string }> = []

    // Preset images
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    try {
      const imageFiles = await fs.readdir(imagesDir)
      for (const file of imageFiles) {
        if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)) {
          images.push({
            name: file,
            url: `/images/${file}`,
            category: 'Site Assets',
          })
        }
      }
    } catch {
      // directory might be missing
    }

    // Uploaded images
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      const uploadFiles = await fs.readdir(uploadsDir)
      for (const file of uploadFiles) {
        if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)) {
          images.push({
            name: file,
            url: `/uploads/${file}`,
            category: 'Uploaded Media',
          })
        }
      }
    } catch {
      // directory might not exist yet
    }

    // Add root logo/brand images if available
    const rootPublic = path.join(process.cwd(), 'public')
    try {
      const rootFiles = await fs.readdir(rootPublic)
      for (const file of rootFiles) {
        if (file.toLowerCase().includes('logo') && /\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
          images.push({
            name: file,
            url: `/${file}`,
            category: 'Branding',
          })
        }
      }
    } catch {
      // ignore
    }

    return NextResponse.json({ images })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to list images' },
      { status: 500 }
    )
  }
}
