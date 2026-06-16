import { useState } from 'react'
import {
  Box, Typography, Button, Chip, LinearProgress,
  List, ListItem, Tooltip
} from '@mui/material'
import {
  EditOutlined,
  PauseCircleOutlineOutlined,
  PlayCircleOutlineOutlined,
  CancelOutlined,
  AddOutlined,
  PlayArrowOutlined,
  CheckOutlined,
  BlockOutlined,
  ReceiptOutlined,
  VisibilityOutlined,
  TaskAltOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  TagOutlined,
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetSingleProject } from '../hooks/useGetSingleProject'
import type { ProjectStatus } from '../types/types'
import type { Milestone, MilestoneStatus } from '../../milestone/types/types'
import { useMilestoneStore } from '../../milestone/stores/milestoneStore'
import { MilestoneModalForm } from '../../milestone/components/MilestoneModalForm'
import { useUpdateMilestoneStatus } from '../../milestone/hooks/useUpdateMilestoneStatus'
import { useInvoiceStore } from '../../invoice/stores/InvoiceStore'
import InvoiceModalForm from '../../invoice/components/InvoiceModalForm'
import toast from 'react-hot-toast'
import type { Invoice } from '../../invoice/types/types'
import { useProjectStore } from '../stores/ProjectStore'
import { AddProjectModal } from '../components/AddProjectModal'
import { useUpdateProjectStatus } from '../hooks/useUpdateProjectStatus'
import { WarningDialog } from '../../../shared/components/WarningDialog'
import { useWarningDialogStore } from '../../../shared/hooks/useWarningDialogStore'

// ── status config ────────────────────────────────────────────────────────────

const projectStatusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active:    { label: 'Active',    bg: '#E1F5EE', color: '#0F6E56' },
  on_hold:   { label: 'On hold',   bg: '#FAEEDA', color: '#854F0B' },
  completed: { label: 'Completed', bg: '#EAF3DE', color: '#3B6D11' },
  cancelled: { label: 'Cancelled', bg: '#FCEBEB', color: '#A32D2D' },
}

const milestoneStatusConfig: Record<MilestoneStatus, { label: string; bg: string; color: string }> = {
  pending:     { label: 'Pending',     bg: '#F1EFE8', color: '#5F5E5A' },
  in_progress: { label: 'In progress', bg: '#FAEEDA', color: '#854F0B' },
  completed:   { label: 'Completed',   bg: '#E6F1FB', color: '#185FA5' },
  invoiced:    { label: 'Invoiced',    bg: '#EEEDFE', color: '#534AB7' },
  paid:        { label: 'Paid',        bg: '#EAF3DE', color: '#3B6D11' },
  cancelled:   { label: 'Cancelled',   bg: '#FCEBEB', color: '#A32D2D' },
}

// ── component ────────────────────────────────────────────────────────────────

export const SingleProject = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return <Typography sx={{p:3}} color="text.secondary">Project ID not found.</Typography>

  const { data: project } = useGetSingleProject(id)
  console.log(project)
  const { mutate: updateMs } = useUpdateMilestoneStatus()
  const { mutate: updateProjectStatus } = useUpdateProjectStatus(id)

  const warningType = useWarningDialogStore(state => state.type)
  const setWarningType = useWarningDialogStore(state => state.setType)

  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)

  const openMsModal = useMilestoneStore(state => state.openModal)
  const setOpenMsModal = useMilestoneStore(state => state.setOpenModal)
  const openInvModal = useInvoiceStore(state => state.openModal)
  const setOpenInvModal = useInvoiceStore(state => state.setOpenModal)
  const openProjectModal = useProjectStore(state => state.openModal)
  const setOpenProjectModal = useProjectStore(state => state.setOpenModal)

  // ── derived state ──────────────────────────────────────────────────────────

  const activeMilestones = project?.milestones?.filter(ml => ml.status !== 'cancelled') ?? []
  const paidMilestones = activeMilestones.filter(ml => ml.status === 'paid')

  const totalMsAmount = activeMilestones.reduce((sum, ml) => sum + ml.amount, 0)
  const totalInvoicedAmount = activeMilestones
    .filter(ml => ml.status === 'invoiced' || ml.status === 'paid')
    .reduce((sum, ml) => sum + ml.amount, 0)
  const totalPaidAmount = paidMilestones.reduce((sum, ml) => sum + ml.amount, 0)
  const totalOutstanding = totalInvoicedAmount - totalPaidAmount

  const progressValue = activeMilestones.length > 0
    ? (paidMilestones.length / activeMilestones.length) * 100
    : 0

  const canComplete = activeMilestones.length > 0 && activeMilestones.every(ml => ml.status === 'paid')
  const readyToInvoice = activeMilestones.filter(ml => ml.status === 'completed' && !ml.invoice_id)

  const status = project?.status
  const isFinal = status === 'completed' || status === 'cancelled'
  const isOnHold = status === 'on_hold'
  const isActive = status === 'active'

  const statusCfg = projectStatusConfig[status ?? 'active']

  // ── handlers ───────────────────────────────────────────────────────────────

  const handleCreateInvoice = (ml: Milestone) => {
    setCurrentMilestone(ml)
    setOpenInvModal(true)
  }

  const handleInvoiceSuccess = (data: Invoice) => {
    if (!currentMilestone) return
    updateMs(
      { milestoneId: currentMilestone.id, status: 'invoiced', invoiceId: data.id },
      {
        onSuccess: () => {
          toast.success('Invoice created and milestone marked as invoiced.')
          setOpenInvModal(false)
          setCurrentMilestone(null)
        },
        onError: () => toast.error('Invoice created but failed to update milestone status.'),
      }
    )
  }

  const handleProjectCancel = () => {
    updateProjectStatus('cancelled', {
      onSuccess: () => {
        toast.success('Project cancelled.')
        setWarningType('none')
      },
      onError: () => toast.error('Something went wrong.'),
    })
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* ── header card ───────────────────────────────────────────────────── */}
      <Box sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
      }}>
        {/* left: title + meta */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3 }}>
            {project?.title}
          </Typography>

          {project?.description && (
            <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.6, maxWidth: 520 }}>
              {project.description}
            </Typography>
          )}

          {/* status + code */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
            <Chip
              label={statusCfg.label}
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 500,
                bgcolor: statusCfg.bg,
                color: statusCfg.color,
                '& .MuiChip-label': { px: 1.25 },
              }}
            />
            <Typography sx={{ fontSize: 12, color: 'text.disabled', fontFamily: 'monospace' }}>
              {project?.project_code ?? '—'}
            </Typography>
          </Box>

          {/* client + dates */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.25, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PersonOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {project?.clients?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {project?.start_date ?? '—'} → {project?.due_date ?? '—'}
              </Typography>
            </Box>
            {project?.project_code && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <TagOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {project.project_code}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* right: action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, alignItems: 'center' }}>
          {!isFinal && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlined />}
              onClick={() => setOpenProjectModal(true)}
              sx={{ color: 'text.secondary', borderColor: 'divider', fontSize: 13 }}
            >
              Edit
            </Button>
          )}

          {isActive && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PauseCircleOutlineOutlined />}
              onClick={() => updateProjectStatus('on_hold')}
              sx={{ color: 'text.secondary', borderColor: 'divider', fontSize: 13 }}
            >
              On hold
            </Button>
          )}

          {isOnHold && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PlayCircleOutlineOutlined />}
              onClick={() => updateProjectStatus('active')}
              sx={{ color: 'text.secondary', borderColor: 'divider', fontSize: 13 }}
            >
              Resume
            </Button>
          )}

          {!isFinal && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<CancelOutlined />}
              onClick={() => setWarningType('project-cancel')}
              sx={{ color: 'error.main', borderColor: 'error.light', fontSize: 13 }}
            >
              Cancel
            </Button>
          )}

          <Tooltip
            title={!canComplete ? 'All milestones must be paid before completing' : ''}
            slotProps={{ tooltip: { sx: { fontSize: 12 } } }}
          >
            <span>
              <Button
                size="small"
                variant="contained"
                startIcon={<TaskAltOutlined />}
                disabled={!canComplete || isFinal}
                onClick={() => updateProjectStatus('completed')}
                sx={{ fontSize: 13 }}
              >
                Mark complete
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* ── progress + financials ──────────────────────────────────────────── */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
            Progress
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
            {paidMilestones.length} / {activeMilestones.length} milestones paid
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 6,
            borderRadius: 999,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: '#1D9E75' },
          }}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 2 }}>
          {[
            { label: 'Total contract', amount: totalMsAmount,      color: 'text.primary' },
            { label: 'Invoiced',       amount: totalInvoicedAmount, color: '#185FA5' },
            { label: 'Paid',           amount: totalPaidAmount,     color: '#3B6D11' },
            { label: 'Outstanding',    amount: totalOutstanding,    color: '#854F0B' },
          ].map(item => (
            <Box
              key={item.label}
              sx={{ bgcolor: 'action.hover', borderRadius: 1.5, p: '12px 14px' }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: item.color }}>
                NPR {item.amount.toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.25, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── milestones ────────────────────────────────────────────────────── */}
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5 }}>

        {/* ready to invoice banner */}
        {readyToInvoice.length > 0 && (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.5, py: 1,
            bgcolor: '#E6F1FB',
            border: '0.5px solid #B5D4F4',
            borderRadius: 1.5,
            mb: 2,
          }}>
            <ReceiptOutlined sx={{ fontSize: 15, color: '#185FA5' }} />
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#185FA5' }}>
              {readyToInvoice.length} milestone{readyToInvoice.length > 1 ? 's' : ''} ready to invoice
            </Typography>
          </Box>
        )}

        {/* section header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
            Milestones
          </Typography>
          <Button
            size="small"
            startIcon={<AddOutlined />}
            disabled={isFinal}
            onClick={() => setOpenMsModal(true)}
            sx={{ fontSize: 13, color: 'text.secondary' }}
          >
            Add
          </Button>
        </Box>

        {/* empty state */}
        {project?.milestones?.length === 0 && (
          <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
            No milestones yet. Add one to get started.
          </Typography>
        )}

        {/* milestone list */}
        <List disablePadding>
          {project?.milestones?.map((ml, index) => {
            const msCfg = milestoneStatusConfig[ml.status ?? 'pending']
            const isPaidOrCancelled = ml.status === 'paid' || ml.status === 'cancelled'

            return (
              <ListItem
                key={ml.id}
                disablePadding
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  borderBottom: '0.5px solid',
                  borderColor: 'divider',
                  opacity: ml.status === 'cancelled' ? 0.5 : 1,
                  '&:last-child': { borderBottom: 'none', pb: 0 },
                }}
              >
                {/* left: index + info */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'monospace', pt: '2px', minWidth: 20 }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: isPaidOrCancelled ? 'text.disabled' : 'text.primary',
                        textDecoration: isPaidOrCancelled ? 'line-through' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ml.title}
                    </Typography>

                    {ml.description && (
                      <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
                        {ml.description}
                      </Typography>
                    )}

                    <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
                      NPR {ml.amount.toLocaleString()}
                      {ml.due_date && ` · Due ${ml.due_date}`}
                    </Typography>
                  </Box>
                </Box>

                {/* right: chip + action */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <Chip
                    label={msCfg.label}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontWeight: 500,
                      bgcolor: msCfg.bg,
                      color: msCfg.color,
                      '& .MuiChip-label': { px: 1.25 },
                    }}
                  />

                  {ml.status === 'pending' && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayArrowOutlined />}
                      onClick={() => updateMs({ milestoneId: ml.id, status: 'in_progress' })}
                      sx={{ fontSize: 12 }}
                    >
                      Start
                    </Button>
                  )}

                  {ml.status === 'in_progress' && (
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckOutlined />}
                        onClick={() => updateMs({ milestoneId: ml.id, status: 'completed' })}
                        sx={{ fontSize: 12 }}
                      >
                        Mark done
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<BlockOutlined />}
                        onClick={() => updateMs({ milestoneId: ml.id, status: 'cancelled' })}
                        sx={{ fontSize: 12, color: 'error.main', borderColor: 'error.light' }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}

                  {ml.status === 'completed' && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ReceiptOutlined />}
                      onClick={() => handleCreateInvoice(ml)}
                      sx={{ fontSize: 12 }}
                    >
                      Create invoice
                    </Button>
                  )}

                  {(ml.status === 'invoiced' || ml.status === 'paid') && (
                    <Button
                      size="small"
                      startIcon={<VisibilityOutlined />}
                      onClick={() => navigate(`/invoices/${ml.invoice_id}`)}
                      sx={{ fontSize: 12, color: 'text.secondary' }}
                    >
                      View invoice
                    </Button>
                  )}
                </Box>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* ── modals ────────────────────────────────────────────────────────── */}
      {openMsModal && <MilestoneModalForm projectId={id} />}

      {openProjectModal && <AddProjectModal initialData={project} resetForm={() => setOpenProjectModal(false)} />}

      {openInvModal && currentMilestone && project && (
        <InvoiceModalForm
          client_id={project.client_id}
          project_data={project}
          preSelectedMs={currentMilestone}
          onInvoiceSuccess={handleInvoiceSuccess}
        />
      )}

      {warningType === 'project-cancel' && (
        <WarningDialog
          handleConfirm={handleProjectCancel}
          handleCancel={() => setWarningType('none')}
          message="Are you sure you want to cancel this project? This cannot be undone."
          title="Cancel project"
        />
      )}

    </Box>
  )
}