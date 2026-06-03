import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Business,
  Delete,
  Edit,
  Email,
  Language,
  LocationOn,
  Phone,
  Add,
  Send,
  NavigateNext,
  Receipt,
} from '@mui/icons-material'

// ─── Static data (replace with API calls) ───────────────────────────────────

const client = {
  id: '1',
  name: 'Acme Technologies Pvt. Ltd.',
  initials: 'AT',
  pan: '123456789',
  email: 'contact@acme.com.np',
  phone: '+977 01-4XXXXXX',
  website: 'acme.com.np',
  address: 'New Baneshwor, Kathmandu 44600',
  industry: 'Information Technology',
  companyType: 'Private Limited',
  paymentTerms: 'Net 15 days',
  currency: 'NPR',
  clientSince: 'May 8, 2026',
  notes:
    'Prefers communication via email. Key contact is the CTO — Rajesh Shrestha. Pays on time when reminded. Avoid calling after 5 PM.',
  totalBilled: 240000,
  totalPaid: 170000,
  outstanding: 70000,
}

const projects = [
  { id: '1', title: 'Website redesign', status: 'Active', started: 'Apr 2026', amount: 80000, progress: 60 },
  { id: '2', title: 'Mobile app MVP', status: 'Paused', started: 'Mar 2026', amount: 120000, progress: 30 },
  { id: '3', title: 'Brand identity', status: 'Completed', started: 'Jan 2026', amount: 40000, progress: 100 },
]

const invoices = [
  { id: 'INV-004', date: 'Due May 30, 2026', amount: 35000, status: 'Overdue' },
  { id: 'INV-003', date: 'Sent Jun 1, 2026', amount: 35000, status: 'Viewed' },
  { id: 'INV-002', date: 'Paid Apr 20, 2026', amount: 120000, status: 'Paid' },
  { id: 'INV-001', date: 'Paid Mar 10, 2026', amount: 50000, status: 'Paid' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatNPR = (amount: number) =>
  `Rs. ${amount.toLocaleString('en-IN')}`

const collectionRate = Math.round((client.totalPaid / client.totalBilled) * 100)

const isHealthy = client.outstanding / client.totalBilled < 0.4

type StatusType = 'Active' | 'Paused' | 'Completed' | 'Overdue' | 'Viewed' | 'Paid' | 'Sent' | 'Draft'

const statusColor: Record<StatusType, 'success' | 'warning' | 'default' | 'error' | 'info' | 'primary'> = {
  Active: 'success',
  Paused: 'warning',
  Completed: 'default',
  Overdue: 'error',
  Viewed: 'warning',
  Paid: 'success',
  Sent: 'info',
  Draft: 'default',
}

const projectProgressColor: Record<string, string> = {
  Active: '#1D9E75',
  Paused: '#BA7517',
  Completed: '#888780',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: 13, mt: 0.25 }}>
      {value}
    </Typography>
  </Box>
)

const MetricCard = ({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string
  value: string
  sub: string
  valueColor?: string
}) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: 'action.hover',
      borderRadius: 2,
      p: 1.5,
    }}
  >
    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block' }}>
      {label}
    </Typography>
    <Typography
      sx={{ fontSize: 20, fontWeight: 500, mt: 0.5, color: valueColor ?? 'text.primary' }}
    >
      {value}
    </Typography>
    <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
      {sub}
    </Typography>
  </Paper>
)

// ─── Main component ───────────────────────────────────────────────────────────

export const ClientDetail = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>

      {/* Top bar */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ flex: 1 }}>
          <Link underline="hover" color="text.secondary" href="/clients" sx={{ fontSize: 13 }}>
            Clients
          </Link>
          <Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 500 }}>
            {client.name}
          </Typography>
        </Breadcrumbs>

        <Stack direction="row" sx={{gap:1}}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Send sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 12, textTransform: 'none' }}
          >
            Send invoice
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Edit sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 12, textTransform: 'none' }}
          >
            Edit client
          </Button>
          <Tooltip title="Delete client">
            <IconButton size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '0.5px solid',
          borderColor: 'divider',
          px: 3,
          py: 2.5,
        }}
      >
        <Stack direction="row" sx={{gap:2, alignItems: "flex-start"}}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 500, fontSize: 18 }}>
            {client.initials}
          </Avatar>
          <Box sx={{flex:1}}>
            <Stack direction="row" sx={{alignItems:"center", gap:1.5, flexWrap: 'wrap'}}>
              <Typography variant="h6" sx={{ fontWeight: 500, fontSize: 18 }}>
                {client.name}
              </Typography>
              <Chip
                label={isHealthy ? 'Healthy' : 'At risk'}
                size="small"
                color={isHealthy ? 'success' : 'error'}
                sx={{ fontSize: 11, height: 20 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, mt: 0.5, display: 'block' }}>
              PAN: {client.pan} &nbsp;·&nbsp; Client since {client.clientSince} &nbsp;·&nbsp; {client.address}
            </Typography>
            <Stack direction="row" sx={{gap:2.5, mt: 1.25, flexWrap: 'wrap'}}>
              {[
                { icon: <Email sx={{ fontSize: 14 }} />, label: client.email },
                { icon: <Phone sx={{ fontSize: 14 }} />, label: client.phone },
                { icon: <Language sx={{ fontSize: 14 }} />, label: client.website },
              ].map(({ icon, label }) => (
                <Stack key={label} direction="row" sx={{alignItems:"center" ,gap:0.75}}>
                  <Box color="text.secondary">{icon}</Box>
                  <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 3, pt: 2.5 }}>

        {/* Metrics */}
        <Grid container sx={{spacing:1.5, mb:2.5}}>
          {[
            { label: 'Total billed', value: formatNPR(client.totalBilled), sub: '4 invoices' },
            { label: 'Amount paid', value: formatNPR(client.totalPaid), sub: `${collectionRate}% collected`, valueColor: '#085041' },
            { label: 'Outstanding', value: formatNPR(client.outstanding), sub: '2 invoices due', valueColor: '#A32D2D' },
            { label: 'Active projects', value: '2', sub: 'of 3 total' },
          ].map((m) => (
            <Grid sx={{xs:6, sm:3}} key={m.label}>
              <MetricCard {...m} />
            </Grid>
          ))}
        </Grid>

        {/* Body */}
        <Grid container spacing={2}>

          {/* Left column */}
          <Grid item xs={12} md={4}>
            <Stack sx={{gap:2}}>

              {/* Contact details */}
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Contact details"
                  titleTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  action={
                    <IconButton size="small">
                      <Edit sx={{ fontSize: 15 }} />
                    </IconButton>
                  }
                  sx={{ pb: 1, pt: 1.5, px: 2 }}
                />
                <Divider />
                <CardContent sx={{ px: 2, py: 1.5 }}>
                  <Stack sx={{gap:1.5}}>
                    <InfoItem label="Company type" value={client.companyType} />
                    <InfoItem label="Industry" value={client.industry} />
                    <InfoItem label="PAN number" value={client.pan} />
                    <InfoItem label="Billing address" value={client.address} />
                    <InfoItem label="Payment terms" value={client.paymentTerms} />
                    <InfoItem label="Currency" value={`${client.currency} (Nepali Rupee)`} />
                  </Stack>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Notes"
                  titleTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  sx={{ pb: 1, pt: 1.5, px: 2 }}
                />
                <Divider />
                <CardContent sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.7 }}>
                    {client.notes}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit sx={{ fontSize: 13 }} />}
                    sx={{ mt: 1.5, fontSize: 11, textTransform: 'none' }}
                  >
                    Edit notes
                  </Button>
                </CardContent>
              </Card>

              {/* Collection rate */}
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Collection rate"
                  titleTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  sx={{ pb: 1, pt: 1.5, px: 2 }}
                />
                <Divider />
                <CardContent sx={{ px: 2, py: 1.5 }}>
                  <Stack direction="row" sx={{justifyContent:"space-between" ,alignItems:"baseline", mb:0.75}}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                      {formatNPR(client.totalPaid)} of {formatNPR(client.totalBilled)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#085041' }}>
                      {collectionRate}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={collectionRate}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: '#1D9E75', borderRadius: 2 },
                    }}
                  />
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11, mt: 0.75, display: 'block' }}>
                    {formatNPR(client.outstanding)} still outstanding
                  </Typography>
                </CardContent>
              </Card>

            </Stack>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={8}>
            <Stack gap={2}>

              {/* Projects */}
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Projects"
                  titleTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  action={
                    <Button
                      size="small"
                      startIcon={<Add sx={{ fontSize: 14 }} />}
                      sx={{ fontSize: 11, textTransform: 'none' }}
                    >
                      Add project
                    </Button>
                  }
                  sx={{ pb: 1, pt: 1.5, px: 2 }}
                />
                <Divider />
                <CardContent sx={{ px: 2, py: 0 }}>
                  {projects.map((project, i) => (
                    <Box key={project.id}>
                      <Stack
                        direction="row"
                        sx={{alignItems:"center",
                        justifyContent:"space-between",
                        py:1.5,
                        gap:2}}
                      >
                        <Box sx={{flex:1}}>
                          <Stack direction="row" sx={{alignItems:"center" ,justifyContent:"space-between", mb:0.5}}>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                              {project.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                              {formatNPR(project.amount)}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11, display: 'block', mb: 0.75 }}>
                            Started {project.started}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={project.progress}
                            sx={{
                              height: 3,
                              borderRadius: 2,
                              bgcolor: 'action.hover',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: projectProgressColor[project.status],
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                        <Chip
                          label={project.status}
                          size="small"
                          color={statusColor[project.status as StatusType]}
                          sx={{ fontSize: 11, height: 20, minWidth: 72 }}
                        />
                      </Stack>
                      {i < projects.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Invoice history */}
              <Card elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardHeader
                  title="Invoice history"
                  titleTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  action={
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Add sx={{ fontSize: 14 }} />}
                      sx={{ fontSize: 11, textTransform: 'none' }}
                    >
                      New invoice
                    </Button>
                  }
                  sx={{ pb: 1, pt: 1.5, px: 2 }}
                />
                <Divider />
                <CardContent sx={{ px: 2, py: 0 }}>
                  {invoices.map((invoice, i) => (
                    <Box key={invoice.id}>
                      <Stack
                        direction="row"
                        sx={{alignItems:"center",
                        justifyContent:"space-between",
                        py:1.5}}
                      >
                        <Stack direction="row" sx={{alignItems:"center", gap:1.5}}>
                          <Receipt sx={{ fontSize: 16, color: 'text.disabled' }} />
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                              #{invoice.id}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                              {invoice.date}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack sx={{direction:"row", alignItems:"center", gap:1.5}}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            {formatNPR(invoice.amount)}
                          </Typography>
                          <Chip
                            label={invoice.status}
                            size="small"
                            color={statusColor[invoice.status as StatusType]}
                            sx={{ fontSize: 11, height: 20, minWidth: 64 }}
                          />
                        </Stack>
                      </Stack>
                      {i < invoices.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>

            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
