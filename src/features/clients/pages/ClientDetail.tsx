import {
  Box, Typography, Chip, Button, IconButton,
  Avatar, LinearProgress, Breadcrumbs, Link, Skeleton, InputBase
} from '@mui/material'
import {
  NavigateNext,
  EmailOutlined,
  PhoneOutlined,
  EditOutlined,
  AddOutlined,
  ReceiptOutlined,
  CalendarTodayOutlined,
  LocationOnOutlined,
  CancelOutlined
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetSingleClient } from '../hooks/useGetSingleClient'
import type { ProjectStatus } from '../../projects/types/types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { useEditClientContact } from '../hooks/useEditClientContact'
import toast from 'react-hot-toast'
import { AddProjectModal } from '../../projects/components/AddProjectModal'
import { useProjectStore } from '../../projects/stores/ProjectStore'

// ── helpers ───────────────────────────────────────────────────────────────────

const fmtNPR = (n: number) => `NPR ${n.toLocaleString('en-IN')}`

// ── status maps ───────────────────────────────────────────────────────────────

const projectChip: Record<ProjectStatus, { bgcolor: string; color: string; label: string }> = {
  active:    { bgcolor: '#E1F5EE', color: '#0F6E56', label: 'Active' },
  completed: { bgcolor: '#F1EFE8', color: '#5F5E5A', label: 'Completed' },
  on_hold:   { bgcolor: '#FAEEDA', color: '#854F0B', label: 'On hold' },
  cancelled: { bgcolor: '#FDECEC', color: '#B42318', label: 'Cancelled' },
}

const progressBarColor: Record<ProjectStatus, string> = {
  active:    '#1D9E75',
  completed: '#888780',
  on_hold:   '#BA7517',
  cancelled: '#D92D20',
}

export const editContactSchema = z.object({
  email:   z.string().email(),
  phone:   z.string().min(10).max(15).regex(/^\d+$/, 'Numbers only'),
  address: z.string().min(5),
})
export type EditContactType = z.infer<typeof editContactSchema>

// ── sub-components ────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) => (
  <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{
      px: 2.5, py: 1.75,
      borderBottom: '0.5px solid', borderColor: 'divider',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{title}</Typography>
      {action}
    </Box>
    {children}
  </Box>
)

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 13, color: 'text.primary', mt: 0.25 }}>{value}</Typography>
  </Box>
)

const EditableInfoRow = ({ label, registration }: { label: string; registration: UseFormRegisterReturn }) => (
  <Box>
    <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </Typography>
    <InputBase
      {...registration}
      sx={{
        fontSize: 13, color: 'text.primary', mt: 0.25, p: 0, width: '100%',
        '& .MuiInputBase-input': {
          p: 0, fontSize: 13, color: 'text.primary',
          borderBottom: '1px solid', borderColor: 'divider',
          '&:focus': { borderColor: 'text.primary', outline: 'none' },
        },
      }}
    />
  </Box>
)

// ── main component ────────────────────────────────────────────────────────────

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) return <p>No client to render</p>

  const navigate = useNavigate()
  const { data: client, isLoading } = useGetSingleClient(id!)
  const [isEditing, setIsEditing] = useState(false)
  const { register, handleSubmit, reset } = useForm<EditContactType>()
  const { mutate: editContactInfo } = useEditClientContact(id)

  const invoices   = client?.invoices ?? []
  const projects   = client?.projects ?? []
  const milestones = client?.projects.flatMap(p => p.milestones) ?? []

  const totalBilled = milestones
    .filter(ml => ml?.status === 'invoiced' || ml?.status === 'paid')
    .reduce((sum, el) => (el ? sum + el.amount : sum), 0)

  const totalPaid = milestones
    .filter(ml => ml?.status === 'paid')
    .reduce((s, i) => s + Number(i?.amount), 0)

  const outstanding = projects.reduce((projectSum, project) => {
    const invoicedAmount = project.milestones?.reduce((ms, milestone) =>
      milestone.status === 'invoiced' ? ms + milestone.amount : ms, 0) ?? 0
    return projectSum + invoicedAmount
  }, 0)

  const collectionRate     = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0
  const isHealthy          = totalBilled === 0 || outstanding / totalBilled < 0.4
  const activeProjectCount = projects.filter(p => p.status === 'active').length

  const openProjectModal    = useProjectStore(state => state.openModal)
  const setOpenProjectModal = useProjectStore(state => state.setOpenModal)

  // ── loading ───────────────────────────────────────────────────────────────

  if (isLoading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Skeleton width="30%" height={16} />
      <Skeleton variant="rounded" height={100} sx={{ borderRadius: 2 }} />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={72} sx={{ flex: 1, borderRadius: 2 }} />)}
      </Box>
      <Skeleton variant="rounded" height={240} sx={{ borderRadius: 2 }} />
    </Box>
  )

  if (!client) return (
    <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
      Client not found.
    </Typography>
  )

  const onSubmit = (data: EditContactType) => {
    editContactInfo(data, {
      onSuccess: () => {
        toast.success('Edited client details.')
        setIsEditing(false)
        reset()
      },
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* ── breadcrumb ──────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />}>
          <Link
            underline="hover"
            onClick={() => navigate('/clients')}
            sx={{ fontSize: 13, color: 'text.secondary', cursor: 'pointer' }}
          >
            Clients
          </Link>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
            {client.name}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* ── hero card ────────────────────────────────────────────────────── */}
      <Box sx={{
        border: '1px solid', borderColor: 'divider', borderRadius: 2,
        p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2,
      }}>
        <Avatar sx={{ width: 44, height: 44, bgcolor: '#E1F5EE', color: '#0F6E56', fontSize: 15, fontWeight: 500, flexShrink: 0 }}>
          {client.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 500 }}>{client.name}</Typography>
            <Chip
              label={isHealthy ? 'Healthy' : 'At risk'}
              size="small"
              sx={{
                height: 22, fontSize: 11, fontWeight: 500,
                bgcolor: isHealthy ? '#E1F5EE' : '#FCEBEB',
                color: isHealthy ? '#0F6E56' : '#A32D2D',
                '& .MuiChip-label': { px: 1.25 },
              }}
            />
          </Box>

          {/* PAN · address */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
            {client.pan_number && (
              <>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>PAN {client.pan_number}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>·</Typography>
              </>
            )}
            {client.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{client.address}</Typography>
              </Box>
            )}
          </Box>

          {/* contact chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            {[
              { icon: <EmailOutlined sx={{ fontSize: 12 }} />, value: client.email },
              { icon: <PhoneOutlined sx={{ fontSize: 12 }} />, value: client.phone },
            ]
              .filter(c => c.value)
              .map(({ icon, value }) => (
                <Box key={value} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ color: 'text.disabled' }}>{icon}</Box>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{value}</Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      {/* ── metric cards — 2×2 on mobile, 4-col on sm+ ──────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1 }}>
        {[
          { label: 'Total billed',    value: fmtNPR(totalBilled),   sub: `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}` },
          { label: 'Amount paid',     value: fmtNPR(totalPaid),     sub: `${collectionRate}% collected`, valueColor: '#085041' },
          { label: 'Outstanding',     value: fmtNPR(outstanding),   sub: 'sent, not paid', valueColor: outstanding > 0 ? '#A32D2D' : undefined },
          { label: 'Active projects', value: String(activeProjectCount), sub: `of ${projects.length} total` },
        ].map(m => (
          <Box key={m.label} sx={{ bgcolor: 'action.hover', borderRadius: 1.5, p: '12px 14px' }}>
            <Typography sx={{ fontSize: { xs: 13, sm: 15 }, fontWeight: 500, color: m.valueColor ?? 'text.primary', wordBreak: 'break-word' }}>
              {m.value}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em', mt: 0.5 }}>
              {m.label}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.25 }}>{m.sub}</Typography>
          </Box>
        ))}
      </Box>

      {/* ── body: sidebar + main ─────────────────────────────────────────── */}
      {/*
        On mobile: single column, sidebar cards appear AFTER the main content
        (projects first, then contact / notes / collection rate).
        On sm+: two-column layout with sidebar on the left.
      */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: 'flex-start' }}>

        {/* ── right column (projects + invoices) — shown first on mobile ── */}
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: 1.5,
          flex: 1, minWidth: 0,
          order: { xs: 1, md: 2 },   // mobile: first; desktop: second
        }}>

          {/* Projects */}
          <SectionCard
            title="Projects"
            action={
              <Button
                size="small"
                startIcon={<AddOutlined sx={{ fontSize: 13 }} />}
                sx={{ fontSize: 12, color: 'text.secondary' }}
                onClick={() => setOpenProjectModal(true)}
              >
                Add project
              </Button>
            }
          >
            {projects.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
                No projects yet.
              </Typography>
            ) : (
              projects.map((project, idx) => {
                const mls       = project.milestones ?? []
                const total     = mls.length
                const completed = mls.filter(m => m.status === 'completed').length
                const progress  = total > 0 ? Math.round((completed / total) * 100) : 0
                const projectValue = mls.reduce((s, m) => s + Number(m.amount ?? 0), 0)
                const chip      = projectChip[project.status as ProjectStatus] ?? projectChip['active']

                return (
                  <Box
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{
                      px: 2.5, py: 1.5,
                      borderBottom: idx < projects.length - 1 ? '0.5px solid' : 'none',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25, gap: 1 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {project.title}
                          </Typography>
                          {projectValue > 0 && (
                            <Typography sx={{ fontSize: 12, color: 'text.secondary', flexShrink: 0 }}>
                              {fmtNPR(projectValue)}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: total > 0 ? 0.75 : 0 }}>
                          <CalendarTodayOutlined sx={{ fontSize: 11, color: 'text.disabled' }} />
                          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
                            {project.start_date
                              ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : 'No start date'}
                          </Typography>
                        </Box>
                        {total > 0 && (
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 6, borderRadius: 999, bgcolor: 'action.hover',
                              '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: progressBarColor[project.status as ProjectStatus] ?? '#1D9E75' },
                            }}
                          />
                        )}
                      </Box>
                      <Chip
                        label={chip.label}
                        size="small"
                        sx={{
                          height: 22, fontSize: 11, fontWeight: 500,
                          bgcolor: chip.bgcolor, color: chip.color,
                          '& .MuiChip-label': { px: 1.25 },
                          flexShrink: 0, mt: '1px',
                        }}
                      />
                    </Box>
                  </Box>
                )
              })
            )}
          </SectionCard>

          {/* Invoice history */}
          <SectionCard
            title="Invoice history"
            action={
              <Button
                size="small"
                variant="contained"
                startIcon={<AddOutlined sx={{ fontSize: 13 }} />}
                sx={{ fontSize: 12 }}
                disabled
              >
                New invoice
              </Button>
            }
          >
            {invoices.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
                No invoices yet.
              </Typography>
            ) : (
              invoices
                .slice()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((invoice, idx) => (
                  <Box
                    key={invoice.id}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      px: 2.5, py: 1.5,
                      borderBottom: idx < invoices.length - 1 ? '0.5px solid' : 'none',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ReceiptOutlined sx={{ fontSize: 15, color: 'text.disabled', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{invoice.invoice_number}</Typography>
                      <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.25 }}>
                        {invoice.due_date
                          ? `Due ${invoice.due_date}`
                          : new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                      {fmtNPR(Number(invoice.total))}
                    </Typography>
                    <Chip
                      label={invoice.status}
                      size="small"
                      sx={{ height: 22, fontSize: 11, fontWeight: 500, '& .MuiChip-label': { px: 1.25 }, flexShrink: 0 }}
                    />
                  </Box>
                ))
            )}
          </SectionCard>

        </Box>

        {/* ── left column (contact / notes / collection) ─────────────────── */}
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: 1.5,
          width: { xs: '100%', md: 260 },
          flexShrink: 0,
          order: { xs: 2, md: 1 },   // mobile: second; desktop: first
        }}>

          {/* Contact details */}
          <SectionCard
            title="Contact details"
            action={
              <IconButton size="small" sx={{ color: 'text.disabled' }} onClick={() => setIsEditing(prev => !prev)}>
                {isEditing
                  ? <CancelOutlined sx={{ fontSize: 15 }} />
                  : <EditOutlined sx={{ fontSize: 15 }} />}
              </IconButton>
            }
          >
            <Box
              sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {isEditing ? (
                <>
                  {client.email   && <EditableInfoRow label="Email"   registration={register('email')} />}
                  {client.phone   && <EditableInfoRow label="Phone"   registration={register('phone')} />}
                  {client.address && <EditableInfoRow label="Address" registration={register('address')} />}
                  <Button
                    type="submit"
                    size="small"
                    sx={{ fontSize: 12, border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
                  >
                    Save changes
                  </Button>
                </>
              ) : (
                <>
                  {client.billing_name && <InfoRow label="Billing name" value={client.billing_name} />}
                  {client.pan_number   && <InfoRow label="PAN / VAT"    value={client.pan_number} />}
                  {client.email        && <InfoRow label="Email"         value={client.email} />}
                  {client.phone        && <InfoRow label="Phone"         value={client.phone} />}
                  {client.address      && <InfoRow label="Address"       value={client.address} />}
                </>
              )}
            </Box>
          </SectionCard>

          {/* Notes */}
          <SectionCard title="Notes">
            <Box sx={{ p: 2.5 }}>
              {client.notes ? (
                <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.7 }}>
                  {client.notes}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 1 }}>
                  No notes yet.
                </Typography>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditOutlined sx={{ fontSize: 13 }} />}
                sx={{ mt: 1.5, fontSize: 12, borderColor: 'divider', color: 'text.secondary' }}
              >
                Edit notes
              </Button>
            </Box>
          </SectionCard>

          {/* Collection rate */}
          <SectionCard title="Collection rate">
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {fmtNPR(totalPaid)} of {fmtNPR(totalBilled)}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#0F6E56' }}>
                  {collectionRate}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={collectionRate}
                sx={{
                  height: 6, borderRadius: 999, bgcolor: 'action.hover',
                  '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: '#1D9E75' },
                }}
              />
              <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.75 }}>
                {fmtNPR(outstanding)} outstanding
              </Typography>
            </Box>
          </SectionCard>

        </Box>
      </Box>

      {openProjectModal && <AddProjectModal clientPrefillId={id} />}
    </Box>
  )
}