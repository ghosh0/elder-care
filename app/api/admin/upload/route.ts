import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { AdminRole } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession([
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.CONTENT_MANAGER,
    ])

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    // Sanitize filename and append timestamp
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFileName = `${Date.now()}-${cleanFileName}`
    const filePath = path.join(uploadsDir, uniqueFileName)

    await fs.writeFile(filePath, buffer)

    const publicUrl = `/uploads/${uniqueFileName}`

    return NextResponse.json({ success: true, url: publicUrl })
  } catch (error: any) {
    console.error('Image upload failed:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}
