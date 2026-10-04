import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { requireAdminSession } from '@/lib/admin-auth'
import { Button } from '@/components/ui/button'
import { AdminRole } from '@prisma/client'

async function signOutAction() {
  'use server'

  await auth.api.signOut({ headers: await headers() })
  redirect('/admin/login')
}

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { adminUser } = await requireAdminSession()
  const canViewInquiries = (
    [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.COORDINATOR,
      AdminRole.SUPPORT,
    ] as AdminRole[]
  ).includes(adminUser.role)
  const canManageBlog = (
    [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.CONTENT_MANAGER,
    ] as AdminRole[]
  ).includes(adminUser.role)
  const canManageLanding = (
    [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.CONTENT_MANAGER,
      AdminRole.COORDINATOR,
    ] as AdminRole[]
  ).includes(adminUser.role)
  const canManageTeam = adminUser.role === AdminRole.SUPER_ADMIN

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Operations Console</p>
            <h1 className="font-serif text-2xl font-bold text-foreground">Ayushman Elder Care Service Admin</h1>
            <p className="text-xs text-muted-foreground">
              {adminUser.name} • {adminUser.role}
            </p>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl items-start grid-cols-1 gap-6 px-6 py-8 md:grid-cols-[240px_1fr]">
        <aside className="self-start md:sticky md:top-24 md:max-h-[calc(100vh-7.5rem)] md:overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
          <nav className="space-y-1">
            <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Dashboard
            </Link>
            {canManageLanding ? (
              <Link
                href="/admin/landing"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Landing Page
              </Link>
            ) : null}
            {canViewInquiries ? (
              <Link
                href="/admin/inquiries"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Inquiries
              </Link>
            ) : null}
            {canManageBlog ? (
              <Link href="/admin/blog" className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Blog
              </Link>
            ) : null}
            {canManageTeam ? (
              <Link href="/admin/team" className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Team
              </Link>
            ) : null}

            {/* Account section */}
            <div className="pt-3">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Account
              </p>
              <Link
                href="/admin/change-password"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                🔑 Change Password
              </Link>
            </div>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  )
}
