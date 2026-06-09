import React, { useState } from 'react'
import {
  Box, Button, Card, CardContent, Chip, Typography,
  LinearProgress, List, ListItem, ListItemText, Divider,
  IconButton,
} from '@mui/material'
import {
  ArrowBackRounded, AddRounded, EditRounded,
  PlayArrowRounded, CheckCircleOutlineRounded,
  ReceiptRounded, VisibilityRounded, DeleteRounded,
  BlockRounded, PauseRounded, CancelRounded,
} from '@mui/icons-material'

// ── Mock Data ──────────────────────────────────────────────────────────────

type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'invoiced' | 'paid' | 'cancelled'
type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled'
type InvoiceStatus = 'draft' | 'sent' | 'invoiced' | 'paid'

interface Milestone {
  id: string
  name: string
  amount: number
  due_date: string | null
  status: MilestoneStatus
  invoice_id: string | null
}

interface Invoice {
  id: string
  invoice_number: string
  milestone_name: string
  amount: number
  status: InvoiceStatus
  due_date: string
}

interface Project {
  id: string
  title: string
  project_code: string
  status: ProjectStatus
  client_name: string
  start_date: string
  due_date: string
}

const mockProject: Project = {
  id: '1',
  title: 'Website Redesign',
  project_code: 'PRJ-001',
  status: 'active',
  client_name: 'Acme Corp',
  start_date: '1 Jan 2025',
  due_date: '31 Mar 2025',
}

const mockMilestones: Milestone[] = [
  { id: '1', name: 'Design mockups',  amount: 15000, due_date: '15 Jan 2025', status: 'paid',      invoice_id: 'inv-1' },
  { id: '2', name: 'Frontend build',  amount: 30000, due_date: '28 Feb 2025', status: 'invoiced',  invoice_id: 'inv-2' },
  { id: '3', name: 'Backend API',     amount: 25000, due_date: '15 Mar 2025', status: 'completed', invoice_id: null },
  { id: '4', name: 'Testing',         amount: 10000, due_date: '25 Mar 2025', status: 'in_progress', invoice_id: null },
  { id: '5', name: 'Deployment',      amount: 5000,  due_date: null,          status: 'pending',   invoice_id: null },
]

const mockInvoices: Invoice[] = [
  { id: 'inv-1', invoice_number: 'INV-001', milestone_name: 'Design mockups', amount: 15000, status: 'paid',    due_date: '25 Jan 2025' },
  { id: 'inv-2', invoice_number: 'INV-002', milestone_name: 'Frontend build',  amount: 30000, status: 'invoiced', due_date: '15 Mar 2025' },
]

const mockActivity = [
  { text: 'Project created',           time: '1 Jan 2025',  color: '#185FA5' },
  { text: 'Design mockups completed',  time: '13 Jan 2025', color: '#1D9E75' },
  { text: 'INV-001 sent to client',    time: '15 Jan 2025', color: '#534AB7' },
  { text: 'INV-001 paid',              time: '24 Jan 2025', color: '#1D9E75' },
  { text: 'Frontend build completed',  time: '27 Feb 2025', color: '#1D9E75' },
  { text: 'INV-002 sent to client',    time: '1 Mar 2025',  color: '#534AB7' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

const milestoneChip: Record<MilestoneStatus, { label: string; bg: string; color: string }> = {
  pending:     { label: 'Pending',     bg: '#F1EFE8', color: '#5F5E5A' },
  in_progress: { label: 'In progress', bg: '#FAEEDA', color: '#854F0B' },
  completed:   { label: 'Completed',   bg: '#E6F1FB', color: '#185FA5' },
  invoiced:    { label: 'Invoiced',    bg: '#EEEDFE', color: '#534AB7' },
  paid:        { label: 'Paid',        bg: '#EAF3DE', color: '#3B6D11' },
  cancelled:   { label: 'Cancelled',   bg: '#FCEBEB', color: '#A32D2D' },
}

const invoiceChip: Record<InvoiceStatus, { label: string; bg: string; color: string }> = {
  draft:    { label: 'Draft',    bg: '#F1EFE8', color: '#5F5E5A' },
  sent:     { label: 'Sent',     bg: '#FAEEDA', color: '#854F0B' },
  invoiced: { label: 'Sent',     bg: '#EEEDFE', color: '#534AB7' },
  paid:     { label: 'Paid',     bg: '#EAF3DE', color: '#3B6D11' },
}

const projectChip: Record<ProjectStatus, { label: string; bg: string; color: string }> = {
  active:    { label: 'Active',    bg: '#E1F5EE', color: '#0F6E56' },
  on_hold:   { label: 'On hold',   bg: '#FAEEDA', color: '#854F0B' },
  completed: { label: 'Completed', bg: '#EAF3DE', color: '#3B6D11' },
  cancelled: { label: 'Cancelled', bg: '#FCEBEB', color: '#A32D2D' },
}

// ── Milestone Actions ──────────────────────────────────────────────────────

function MilestoneActions({ ms }: { ms: Milestone }) {
  if (ms.status === 'pending') return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Button size="small" variant="contained" startIcon={<PlayArrowRounded sx={{ fontSize: 14 }} />}>
        Start
      </Button>
      <IconButton size="small" color="error" aria-label="delete milestone">
        <DeleteRounded fontSize="small" />
      </IconButton>
    </Box>
  )

  if (ms.status === 'in_progress') return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Button size="small" variant="contained" startIcon={<CheckCircleOutlineRounded sx={{ fontSize: 14 }} />}>
        Mark done
      </Button>
      <IconButton size="small" color="error" aria-label="cancel milestone">
        <BlockRounded fontSize="small" />
      </IconButton>
    </Box>
  )

  if (ms.status === 'completed') return (
    <Button size="small" variant="contained" startIcon={<ReceiptRounded sx={{ fontSize: 14 }} />}>
      Create invoice
    </Button>
  )

  if (ms.status === 'invoiced' || ms.status === 'paid') return (
    <Button size="small" color="inherit" startIcon={<VisibilityRounded sx={{ fontSize: 14 }} />}
      sx={{ color: 'text.secondary' }}>
      View invoice
    </Button>
  )

  return null
}

// ── Right Column ───────────────────────────────────────────────────────────

function RightColumn({ milestones, invoices }: { milestones: Milestone[]; invoices: Invoice[] }) {
  const readyToInvoice = milestones.filter(m => m.status === 'completed' && !m.invoice_id)
  const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = totalInvoiced - totalPaid

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* ready to invoice banner */}
      {readyToInvoice.length > 0 && (
        <Box sx={{ px: 1.5, py: 1, bgcolor: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptRounded sx={{ fontSize: 15, color: '#185FA5' }} />
          <Typography variant="caption" sx={{ color: '#185FA5', fontWeight: 500 }}>
            {readyToInvoice.length} milestone{readyToInvoice.length > 1 ? 's' : ''} ready to invoice
          </Typography>
        </Box>
      )}

      {/* invoice list */}
      {invoices.length > 0 && (
        <Card elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider' }}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: '0.5px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={600}>Invoices</Typography>
          </Box>

          <List disablePadding>
            {invoices.map((inv, idx) => {
              const chip = invoiceChip[inv.status]
              return (
                <React.Fragment key={inv.id}>
                  <ListItem sx={{ px: 2, py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                          <Typography variant="body2" fontWeight={500}>{inv.invoice_number}</Typography>
                          <Chip label={chip.label} size="small"
                            sx={{ bgcolor: chip.bg, color: chip.color, fontWeight: 600, height: 18, fontSize: 10 }} />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {inv.milestone_name} · NPR {inv.amount.toLocaleString()}
                        </Typography>
                      }
                    />
                    <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="view invoice">
                      <VisibilityRounded fontSize="small" />
                    </IconButton>
                  </ListItem>
                  {idx < invoices.length - 1 && <Divider />}
                </React.Fragment>
              )
            })}
          </List>

          {/* financial summary */}
          <Box sx={{ px: 2, py: 1.5, borderTop: '0.5px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Total invoiced</Typography>
              <Typography variant="caption" fontWeight={500}>NPR {totalInvoiced.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Total paid</Typography>
              <Typography variant="caption" fontWeight={500} sx={{ color: '#3B6D11' }}>NPR {totalPaid.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">Outstanding</Typography>
              <Typography variant="caption" fontWeight={500} sx={{ color: '#854F0B' }}>NPR {outstanding.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Card>
      )}

      {/* activity log */}
      <Card elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider' }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '0.5px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600}>Activity</Typography>
        </Box>
        <Box sx={{ px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {mockActivity.map((a, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.25 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: a.color, mt: 0.4, flexShrink: 0 }} />
                {i < mockActivity.length - 1 && (
                  <Box sx={{ width: 1, flex: 1, bgcolor: 'divider', mt: 0.5 }} />
                )}
              </Box>
              <Box sx={{ pb: i < mockActivity.length - 1 ? 0.5 : 0 }}>
                <Typography variant="body2" fontWeight={500} fontSize={12}>{a.text}</Typography>
                <Typography variant="caption" color="text.secondary">{a.time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

    </Box>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

export const Settings = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
  const project = mockProject

  const activeMilestones = milestones.filter(m => m.status !== 'cancelled')
  const paidCount = activeMilestones.filter(m => m.status === 'paid').length
  const progress = activeMilestones.length ? (paidCount / activeMilestones.length) * 100 : 0

  const totalContract = activeMilestones.reduce((s, m) => s + m.amount, 0)
  const totalInvoiced = mockInvoices.reduce((s, i) => s + i.amount, 0)
  const totalPaid = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding = totalInvoiced - totalPaid

  const readyToInvoice = milestones.filter(m => m.status === 'completed' && !m.invoice_id)
  const projectChipData = projectChip[project.status]

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 3 }}>

      {/* back */}
      <Button startIcon={<ArrowBackRounded />} sx={{ mb: 2, color: 'text.secondary', pl: 0 }}>
        Projects
      </Button>

      {/* header */}
      <Card elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider', mb: 1.5 }}>
        <CardContent sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" fontWeight={500}>{project.title}</Typography>
                <Chip label={projectChipData.label} size="small"
                  sx={{ bgcolor: projectChipData.bg, color: projectChipData.color, fontWeight: 600 }} />
                <Typography variant="caption" color="text.secondary">{project.project_code}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {project.client_name} &nbsp;·&nbsp; {project.start_date} → {project.due_date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" color="inherit"
                startIcon={<EditRounded sx={{ fontSize: 14 }} />}
                sx={{ color: 'text.secondary', borderColor: 'divider' }}>
                Edit
              </Button>
              <Button size="small" variant="outlined" color="inherit"
                startIcon={<PauseRounded sx={{ fontSize: 14 }} />}
                sx={{ color: 'text.secondary', borderColor: 'divider' }}>
                On hold
              </Button>
              <Button size="small" variant="outlined" color="error"
                startIcon={<CancelRounded sx={{ fontSize: 14 }} />}>
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* progress + financials */}
      <Card elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider', mb: 1.5 }}>
        <CardContent sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="body2" fontWeight={500}>Progress</Typography>
            <Typography variant="caption" color="text.secondary">
              {paidCount} / {activeMilestones.length} milestones paid
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ height: 6, borderRadius: 3, bgcolor: '#F0F0F0', mb: 1.5 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {[
              { label: 'Total contract', value: `NPR ${totalContract.toLocaleString()}`, color: 'text.primary' },
              { label: 'Invoiced',       value: `NPR ${totalInvoiced.toLocaleString()}`, color: '#185FA5' },
              { label: 'Paid',           value: `NPR ${totalPaid.toLocaleString()}`,     color: '#3B6D11' },
              { label: 'Outstanding',    value: `NPR ${outstanding.toLocaleString()}`,   color: '#854F0B' },
            ].map(s => (
              <Box key={s.label} sx={{ bgcolor: 'background.default', borderRadius: 1.5, px: 1.5, py: 1, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={500} sx={{ color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* main content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 1.5 }}>

        {/* milestones */}
        <Card elevation={0} sx={{ border: '0.5px solid', borderColor: 'divider' }}>

          {/* ready to invoice banner */}
          {readyToInvoice.length > 0 && (
            <Box sx={{ px: 2.5, py: 1, bgcolor: '#E6F1FB', borderBottom: '0.5px solid #B5D4F4', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptRounded sx={{ fontSize: 14, color: '#185FA5' }} />
              <Typography variant="caption" sx={{ color: '#185FA5', fontWeight: 500 }}>
                {readyToInvoice.length} milestone{readyToInvoice.length > 1 ? 's' : ''} ready to invoice
              </Typography>
            </Box>
          )}

          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '0.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" fontWeight={600}>Milestones</Typography>
            <Button size="small" startIcon={<AddRounded />}>Add</Button>
          </Box>

          {milestones.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No milestones yet</Typography>
              <Button size="small" startIcon={<AddRounded />} sx={{ mt: 1 }}>Add milestone</Button>
            </Box>
          ) : (
            <List disablePadding>
              {milestones.map((ms, idx) => {
                const chip = milestoneChip[ms.status]
                const isFaded = ms.status === 'paid' || ms.status === 'cancelled'
                return (
                  <React.Fragment key={ms.id}>
                    <ListItem
                      sx={{
                        px: 2.5, py: 1.5,
                        opacity: ms.status === 'cancelled' ? 0.5 : 1,
                        bgcolor: ms.status === 'completed' ? 'rgba(24,95,165,0.03)' : 'transparent',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500} sx={{
                            textDecoration: isFaded ? 'line-through' : 'none',
                            color: isFaded ? 'text.secondary' : 'text.primary',
                          }}>
                            {ms.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            NPR {ms.amount.toLocaleString()}
                            {ms.due_date && ` · Due ${ms.due_date}`}
                          </Typography>
                        }
                      />
                      <Chip label={chip.label} size="small"
                        sx={{ bgcolor: chip.bg, color: chip.color, fontWeight: 600, height: 20, fontSize: 10, mr: 1.5 }} />
                      <MilestoneActions ms={ms} />
                    </ListItem>
                    {idx < milestones.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                )
              })}
            </List>
          )}
        </Card>

        {/* right column */}
        <RightColumn milestones={milestones} invoices={mockInvoices} />

      </Box>
    </Box>
  )
}