import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdminRole, InquiryPriority, InquiryStatus } from '@prisma/client'
import { requireInquiryViewSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { addInquiryNoteAction, updateInquiryAction } from '../actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InquiryDetailPage({ params }: Props) {
  const { adminUser } = await requireInquiryViewSession()
  const { id } = await params
  const canManageInquiry = (
    [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.COORDINATOR,
    ] as AdminRole[]
  ).includes(adminUser.role)

  const inquiry = await prisma.consultationRequest.findUnique({
    where: { id },
    include: {
      assignedAdmin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!inquiry) notFound()

  const adminUsers = await prisma.user.findMany({
    where: {
      isActive: true,
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  const boundUpdateAction = updateInquiryAction.bind(null, inquiry.id)
  const boundNoteAction = addInquiryNoteAction.bind(null, inquiry.id)

  return (
    <main className="space-y-6">
      <Link href="/admin/inquiries" className="text-sm font-semibold text-primary hover:underline">
        Back to inquiries
      </Link>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Lead Detail</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">
          {inquiry.firstName} {inquiry.lastName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{inquiry.email}</p>
        {inquiry.phone ? <p className="text-sm text-muted-foreground">{inquiry.phone}</p> : null}
        {inquiry.city ? <p className="text-sm text-muted-foreground">{inquiry.city}</p> : null}

        <div className="mt-4 rounded-md bg-secondary/40 p-3">
          <p className="text-sm text-foreground">{inquiry.message}</p>
        </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
          <h3 className="font-serif text-xl font-bold text-foreground">Update Inquiry</h3>
          {canManageInquiry ? (
          <form action={boundUpdateAction} className="mt-4 space-y-4">
            <div>
              <Label className="mb-1 block" htmlFor="status">
                Status
              </Label>
              <select
                id="status"
                name="status"
                defaultValue={inquiry.status}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {Object.values(InquiryStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-1 block" htmlFor="priority">
                Priority
              </Label>
              <select
                id="priority"
                name="priority"
                defaultValue={inquiry.priority}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {Object.values(InquiryPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-1 block" htmlFor="assignedAdminId">
                Assign To
              </Label>
              <select
                id="assignedAdminId"
                name="assignedAdminId"
                defaultValue={inquiry.assignedAdminId || ''}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">Unassigned</option>
                {adminUsers.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name} ({admin.role})
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Your role can add notes, but cannot modify inquiry status, priority, or assignment.
            </p>
          )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
          <h3 className="font-serif text-xl font-bold text-foreground">Internal Notes</h3>

          <form action={boundNoteAction} className="mt-4 space-y-3">
            <Textarea
              name="body"
              rows={4}
              placeholder="Add a follow-up note"
              required
            />
            <Button type="submit" variant="outline">Add Note</Button>
          </form>

          <div className="mt-6 space-y-3">
            {inquiry.notes.map((note) => (
              <article key={note.id} className="rounded-lg border border-border bg-secondary/20 p-3">
                <p className="text-sm text-foreground">{note.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {note.admin.name} • {new Date(note.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
            {inquiry.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            ) : null}
          </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
