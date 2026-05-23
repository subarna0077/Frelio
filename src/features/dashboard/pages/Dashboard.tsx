import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';

import {
  FolderRounded,
  PeopleRounded,
  PendingActionsRounded,
  TrendingUpRounded,
  FiberManualRecordRounded,
} from '@mui/icons-material';

import type { ProjectStatus } from '../../projects/types/types';
import { useGetProjects } from '../../projects/hooks/useGetProjects';
import { useGetClients } from '../../clients/hooks/useGetClients';
import { useListInvoices } from '../../invoice/hooks/useListInvoices';
import { useAuthStore } from '../../auth/stores/authStore';

const statusColor: Record<ProjectStatus, 'success' | 'warning' | 'default'> = {
  active: 'success',
  completed: 'default',
  'on-hold': 'warning',
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}> = ({ label, value, icon, color, loading }) => (
  <Card elevation={0} sx={{ flex: 1, minWidth: 220 }}>
    <CardContent sx={{ p: 2.5 }}>
      {loading ? (
        <>
          <Skeleton width={40} height={40} variant="rounded" sx={{ mb: 1.5 }} />
          <Skeleton width="60%" height={32} />
          <Skeleton width="80%" height={20} />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              color,
            }}
          >
            {icon}
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            {value}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {label}
          </Typography>
        </>
      )}
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const { data: projects = [], isLoading: projLoading } = useGetProjects();
  const { data: clients = [], isLoading: clientLoading } = useGetClients();
  const { data: invoices = [], isLoading: invLoading } = useListInvoices();

  const user = useAuthStore(state => state.user);

  const loading = projLoading || clientLoading || invLoading;

  const activeProjects = projects.filter(p => p.status === 'active');

  const pendingPayments = invoices.filter(
    i => i.status === 'draft' || i.status === 'overdue'
  );

  const paidThisMonth = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const activities = [
    { text: 'Invoice #INV-003 marked as paid', time: '2h ago', color: '#1D9E75' },
    { text: 'Milestone "Design handoff" completed', time: '5h ago', color: '#3B82F6' },
    { text: 'New project "E-commerce site" created', time: '1d ago', color: '#F59E0B' },
    { text: 'Client "Ram Bahadur" added', time: '2d ago', color: '#8B5CF6' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {greeting}, {user?.name?.toUpperCase()} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Here's what's happening with your projects today.
        </Typography>
      </Box>

      {/* STAT CARDS (FLEX INSTEAD OF GRID) */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          mb: 3,
        }}
      >
        {[
          {
            label: 'Active Projects',
            value: loading ? '-' : activeProjects.length,
            icon: <FolderRounded />,
            color: '#1D9E75',
          },
          {
            label: 'Total Clients',
            value: loading ? '-' : clients.length,
            icon: <PeopleRounded />,
            color: '#3B82F6',
          },
          {
            label: 'Pending Payments',
            value: loading ? '-' : pendingPayments.length,
            icon: <PendingActionsRounded />,
            color: '#F59E0B',
          },
          {
            label: 'Earned This Month',
            value: loading ? '-' : `NPR ${paidThisMonth.toLocaleString()}`,
            icon: <TrendingUpRounded />,
            color: '#8B5CF6',
          },
        ].map(card => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </Box>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Active Projects */}
        <Box sx={{ flex: 2, minWidth: 320 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F0F0F0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Active Projects
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} height={60} variant="rounded" />
                  ))}
                </Box>
              ) : activeProjects.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <FolderRounded sx={{ fontSize: 40, color: '#E0E0E0', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No active projects
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {activeProjects.map((project, idx) => {
                    if(!project.milestones) {
                      return;
                    }
                    const completedMlCount = project.milestones.filter(ml=> ml.is_completed).length;
                    const totalMlCount = project.milestones.length;
                    const progress =(completedMlCount/totalMlCount) * 100;

                    return (
                      <React.Fragment key={project.id}>
                        <ListItem sx={{ px: 2.5, py: 1.5 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                                noWrap
                              >
                                {project.title}
                              </Typography>

                              <Chip
                                label={project.status}
                                size="small"
                                color={statusColor[project.status]}
                                sx={{ height: 20 }}
                              />
                            </Box>

                            <Typography variant="caption" color="text.secondary">
                              {`${completedMlCount} of ${totalMlCount} milestones completed.`}
                            </Typography>

                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                mt: 1,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: '#F0F0F0',
                              }}
                            />
                          </Box>
                        </ListItem>

                        {idx < activeProjects.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Activity Feed */}
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F0F0F0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
              </Box>

              <List disablePadding>
                {activities.map((a, i) => (
                  <React.Fragment key={i}>
                    <ListItem sx={{ px: 2.5, py: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: `${a.color}18`,
                          mr: 1.5,
                        }}
                      >
                        <FiberManualRecordRounded
                          sx={{ fontSize: 12, color: a.color }}
                        />
                      </Avatar>

                      <ListItemText primary={a.text} secondary={a.time} />
                    </ListItem>

                    {i < activities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};