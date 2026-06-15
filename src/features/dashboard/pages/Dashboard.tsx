import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Skeleton,
  Avatar,
} from '@mui/material';

import {
  FolderOpenOutlined,
  PersonOutlined,
  ReceiptOutlined,
  TrendingUpOutlined,
  TaskAltOutlined,
  CalendarTodayOutlined,
  CheckOutlined,
  AddOutlined,
  SendOutlined,
} from '@mui/icons-material';

import type { ProjectStatus } from '../../projects/types/types';
import { useGetProjects } from '../../projects/hooks/useGetProjects';
import { useGetClients } from '../../clients/hooks/useGetClients';
import { useListInvoices } from '../../invoice/hooks/useListInvoices';
import { useAuthStore } from '../../auth/stores/authStore';
import { RevenueChart } from '../components/RevenueChart';

// ── status color map ──────────────────────────────────────────────────────────

const statusChip: Record<ProjectStatus, { bgcolor: string; color: string; label: string }> = {
  active: { bgcolor: '#E1F5EE', color: '#0F6E56', label: 'Active' },
  completed: { bgcolor: '#F1EFE8', color: '#5F5E5A', label: 'Completed' },
  'on_hold': { bgcolor: '#FAEEDA', color: '#854F0B', label: 'On hold' },
  'cancelled': { bgcolor: '#f29f9f', color: '#ba0606', label: 'Cancelled' },

};

// ── activity dot color map ────────────────────────────────────────────────────

const activityMeta: Record<string, { bgcolor: string; color: string; icon: React.ReactNode }> = {
  created: { bgcolor: '#F1EFE8', color: '#5F5E5A', icon: <AddOutlined sx={{ fontSize: 13 }} /> },
  sent: { bgcolor: '#E6F1FB', color: '#185FA5', icon: <SendOutlined sx={{ fontSize: 13 }} /> },
  paid: { bgcolor: '#E1F5EE', color: '#0F6E56', icon: <CheckOutlined sx={{ fontSize: 13 }} /> },
  milestone: { bgcolor: '#FAEEDA', color: '#854F0B', icon: <TaskAltOutlined sx={{ fontSize: 13 }} /> },
  project: { bgcolor: '#E6F1FB', color: '#185FA5', icon: <FolderOpenOutlined sx={{ fontSize: 13 }} /> },
};

// ── metric card ───────────────────────────────────────────────────────────────

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgcolor: string;
  color: string;
  loading?: boolean;
}> = ({ label, value, icon, bgcolor, color, loading }) => (
  <Box
    sx={{
      flex: 1,
      minWidth: 180,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      p: 2.5,
    }}
  >
    {loading ? (
      <>
        <Skeleton variant="rounded" width={32} height={32} sx={{ mb: 1.5, borderRadius: 1.5 }} />
        <Skeleton width="50%" height={22} />
        <Skeleton width="70%" height={14} sx={{ mt: 0.5 }} />
      </>
    ) : (
      <>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            mb: 1.5,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: 'text.primary', lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em', mt: 0.5 }}>
          {label}
        </Typography>
      </>
    )}
  </Box>
);

// ── dashboard ─────────────────────────────────────────────────────────────────

export const Dashboard = () => {
  const { data: projects = [], isLoading: projLoading } = useGetProjects();
  const { data: clients = [], isLoading: clientLoading } = useGetClients();
  const { data: invoices = [], isLoading: invLoading } = useListInvoices();


  console.log(projects, clients, invoices)

  const user = useAuthStore(state => state.user);
  const loading = projLoading || clientLoading || invLoading;

  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingPayments = invoices.filter(i => i.milestones?.status === 'invoiced');
  const paidThisMonth = invoices
    .filter(i => i.milestones?.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const activities = useMemo(() => {
    const events: { text: string; time: string; type: keyof typeof activityMeta }[] = [];

    invoices.forEach(inv => {
      if (inv.created_at)
        events.push({ text: `Invoice #${inv.invoice_number} created`, time: inv.created_at, type: 'created' });
      if (inv.sent_at)
        events.push({ text: `Invoice #${inv.invoice_number} sent to client`, time: inv.sent_at, type: 'sent' });
      if (inv.paid_at)
        events.push({ text: `Invoice #${inv.invoice_number} marked as paid`, time: inv.paid_at, type: 'paid' });
    });

    projects.forEach(proj => {
      if (proj.created_at)
        events.push({ text: `Project "${proj.title}" created`, time: proj.created_at, type: 'project' });
      proj.milestones?.forEach(ml => {
        if (ml.status==='completed' && ml.completed_at)
          events.push({ text: `Milestone "${ml.title}" completed`, time: ml.completed_at, type: 'milestone' });
      });
    });

    return events
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }, [invoices, projects]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* Page header */}
      <Box>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
          {greeting}, {user?.name}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>
          Here's what's happening with your projects today.
        </Typography>
      </Box>

      {/* Metric cards */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <MetricCard
          label="Active projects"
          value={loading ? '—' : activeProjects.length}
          icon={<FolderOpenOutlined sx={{ fontSize: 15 }} />}
          bgcolor="#E1F5EE" color="#0F6E56"
          loading={loading}
        />
        <MetricCard
          label="Total clients"
          value={loading ? '—' : clients.length}
          icon={<PersonOutlined sx={{ fontSize: 15 }} />}
          bgcolor="#E6F1FB" color="#185FA5"
          loading={loading}
        />
        <MetricCard
          label="Pending payments"
          value={loading ? '—' : pendingPayments.length}
          icon={<ReceiptOutlined sx={{ fontSize: 15 }} />}
          bgcolor="#FAEEDA" color="#854F0B"
          loading={loading}
        />
        <MetricCard
          label="Earned this month"
          value={loading ? '—' : `NPR ${paidThisMonth.toLocaleString()}`}
          icon={<TrendingUpOutlined sx={{ fontSize: 15 }} />}
          bgcolor="#E1F5EE" color="#0F6E56"
          loading={loading}
        />
      </Box>

      {/* Revenue chart */}
      <RevenueChart invoices={invoices} />

      {/* Active projects + Activity feed */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Active projects */}
        <Box
          sx={{
            flex: 2,
            minWidth: 300,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: '0.5px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Active projects</Typography>
          </Box>

          {loading ? (
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[1, 2, 3].map(i => (
                <Box key={i}>
                  <Skeleton width="45%" height={16} />
                  <Skeleton width="65%" height={13} sx={{ mt: 0.5 }} />
                  <Skeleton width="100%" height={6} sx={{ mt: 1, borderRadius: 999 }} />
                </Box>
              ))}
            </Box>
          ) : activeProjects.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
              No active projects yet.
            </Typography>
          ) : (
            activeProjects.map((project, idx) => {
              const milestones = project.milestones ?? [];
              const completed = milestones.filter(ml => ml.status==='completed').length;
              const total = milestones.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;

              return (
                <Box
                  key={project.id}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom: idx < activeProjects.length - 1 ? '0.5px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }} noWrap>
                      {project.title}
                    </Typography>
                    <Chip
                      label={statusChip[project.status].label}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 500,
                        bgcolor: statusChip[project.status].bgcolor,
                        color: statusChip[project.status].color,
                        '& .MuiChip-label': { px: 1.25 },
                        flexShrink: 0,
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: total > 0 ? 1 : 0 }}>
                    <CalendarTodayOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {total > 0
                        ? `${completed} of ${total} milestones completed`
                        : 'No milestones added yet'}
                    </Typography>
                  </Box>

                  {total > 0 && (
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 6,
                        borderRadius: 999,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: '#1D9E75' },
                      }}
                    />
                  )}
                </Box>
              );
            })
          )}
        </Box>

        {/* Activity feed */}
        <Box
          sx={{
            flex: 1,
            minWidth: 260,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: '0.5px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Recent activity</Typography>
          </Box>

          {activities.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
              No recent activity yet.
            </Typography>
          ) : (
            activities.map((a, i) => {
              const meta = activityMeta[a.type];
              return (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    px: 2.5,
                    py: 1.5,
                    borderBottom: i < activities.length - 1 ? '0.5px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: meta.bgcolor,
                      color: meta.color,
                      flexShrink: 0,
                      mt: '1px',
                    }}
                  >
                    {meta.icon}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.4 }}>
                      {a.text}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
                      {new Date(a.time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

      </Box>
    </Box>
  );
};