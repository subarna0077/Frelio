import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Stack,
} from '@mui/material'
import {
  FolderOpen,
  People,
  Receipt,
  TrendingUp,
  CheckCircle,
  RadioButtonUnchecked,
  Add,
} from '@mui/icons-material'

// ── Static mock data ────────────────────────────────────────────────
const stats = [
  { label: 'Active Projects', value: '6', icon: <FolderOpen />, color: '#1D9E75' },
  { label: 'Total Clients', value: '9', icon: <People />, color: '#378ADD' },
  { label: 'Pending Payment', value: 'Rs 75,000', icon: <Receipt />, color: '#E0993A' },
  { label: 'Earned This Month', value: 'Rs 1,20,000', icon: <TrendingUp />, color: '#9B59B6' },
]

const projects = [
  {
    id: 1,
    name: 'Momo Palace Website',
    client: 'Sita Maharjan',
    budget: 'Rs 50,000',
    progress: 60,
    status: 'active',
    deadline: 'June 15',
    milestoneDone: 3,
    milestoneTotal: 5,
  },
  {
    id: 2,
    name: 'E-commerce Dashboard',
    client: 'John Smith',
    budget: '$800',
    progress: 90,
    status: 'payment due',
    deadline: 'May 30',
    milestoneDone: 4,
    milestoneTotal: 4,
  },
  {
    id: 3,
    name: 'Travel Agency Redesign',
    client: 'Bikram Thapa',
    budget: 'Rs 35,000',
    progress: 25,
    status: 'active',
    deadline: 'July 1',
    milestoneDone: 1,
    milestoneTotal: 4,
  },
]

const activities = [
  {
    id: 1,
    message: 'Milestone 3 completed — Momo Palace Website',
    time: 'Today, 10:42 AM',
    color: '#1D9E75',
    done: true,
  },
  {
    id: 2,
    message: 'Invoice #004 sent to John Smith · $800',
    time: 'Yesterday, 4:15 PM',
    color: '#378ADD',
    done: true,
  },
  {
    id: 3,
    message: 'Payment received · Rs 20,000 from Sita (Esewa)',
    time: 'May 4, 2:30 PM',
    color: '#E0993A',
    done: true,
  },
  {
    id: 4,
    message: 'New project created — Travel Agency Redesign',
    time: 'May 3, 9:00 AM',
    color: '#9B59B6',
    done: false,
  },
]

const statusColor: Record<string, 'success' | 'warning' | 'default'> = {
  active: 'success',
  'payment due': 'warning',
  completed: 'default',
}

// ── Component ────────────────────────────────────────────────────────
export const Dashboard = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Good morning, Ram 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Here's what's happening with your projects today.
          </Typography>
        </Box>
        <Stack direction="row" gap={1}>
          <Button variant="outlined" size="small" startIcon={<Add />}>
            New Client
          </Button>
          <Button variant="contained" size="small" startIcon={<Add />}>
            New Project
          </Button>
        </Stack>
      </Stack>

      {/* Stat cards */}
      <Grid container spacing={2} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}18`, color: stat.color, width: 40, height: 40 }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Projects + Activity */}
      <Grid container spacing={3}>

        {/* Active projects */}
        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Active Projects
                </Typography>
                <Button size="small" variant="text">View all</Button>
              </Stack>

              <Stack gap={2}>
                {projects.map((project) => (
                  <Box
                    key={project.id}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': { borderColor: 'primary.main', cursor: 'pointer' },
                      transition: 'border-color 0.15s'
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {project.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.client} · {project.budget}
                        </Typography>
                      </Box>
                      <Chip
                        label={project.status}
                        size="small"
                        color={statusColor[project.status]}
                        sx={{ fontSize: 11, height: 22 }}
                      />
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        height: 4,
                        borderRadius: 99,
                        bgcolor: 'action.hover',
                        mb: 1,
                        '& .MuiLinearProgress-bar': { borderRadius: 99 }
                      }}
                    />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        {project.milestoneDone} of {project.milestoneTotal} milestones
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due {project.deadline}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity log */}
        <Grid item xs={12} md={5}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Recent Activity
              </Typography>

              <List disablePadding>
                {activities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem disablePadding sx={{ py: 1, alignItems: 'flex-start' }}>
                      <ListItemAvatar sx={{ minWidth: 36, mt: 0.5 }}>
                        {activity.done
                          ? <CheckCircle sx={{ fontSize: 18, color: activity.color }} />
                          : <RadioButtonUnchecked sx={{ fontSize: 18, color: 'text.disabled' }} />
                        }
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.primary" lineHeight={1.5}>
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ ml: 4.5 }} />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  )
}