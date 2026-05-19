import React, { useState } from 'react';
import {
  Box, Button, Typography, Card, CardContent, Chip,
  LinearProgress, List, ListItem, ListItemText, Checkbox,
  Skeleton, Divider, IconButton,
} from '@mui/material';
import {
  ArrowBackRounded, AddRounded, ReceiptRounded,
  FlagRounded, CheckCircleRounded, RadioButtonUncheckedRounded,DeleteRounded
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSingleProject } from '../hooks/useGetSingleProject';
import { useListMilestones } from '../../milestone/hooks/useListMilestones';
import { useCompleteMilestone } from '../../milestone/hooks/useCompleteMilestone';
import type { ProjectStatus } from '../types/types';
import { MilestoneModalForm } from '../../milestone/components/MilestoneModalForm';
import { useDeleteMilestone } from '../../milestone/hooks/useDeleteMilestone';
import { useMilestoneStore } from '../../milestone/stores/milestoneStore';
import { useInvoiceStore } from '../../invoice/stores/InvoiceStore';

import InvoiceModalForm from '../../invoice/components/InvoiceModalForm';


import toast from 'react-hot-toast';

const statusColors: Record<ProjectStatus, { bg: string; color: string }> = {
  active: { bg: 'rgba(29,158,117,0.1)', color: '#1D9E75' },
  completed: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
  'on-hold': { bg: 'rgba(245,158,11,0.1)', color: '#D97706' },
};

export const SingleProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading: projLoading } = useGetSingleProject(id!);
  const { data: milestones = [], isLoading: msLoading } = useListMilestones(id!);
  const { mutate: completeMilestone } = useCompleteMilestone();
  const {mutate: deleteMilestone} = useDeleteMilestone();


  // Milestone store modal 
  const openMilestoneModal = useMilestoneStore(state=> state.openModal)
  const setOpenMilestoneModal = useMilestoneStore(state=> state.setOpenModal)


  // Invoice modal store 
  const openInvoiceModal = useInvoiceStore(state=> state.openModal)
  const setOpenInvoiceModal = useInvoiceStore(state=> state.setOpenModal)



  

  const loading = projLoading || msLoading;
  const completedCount = milestones.filter(m => m.is_completed).length;
  const progress = milestones.length ? (completedCount / milestones.length) * 100 : 0;


  const handleCompleteMilestone = (msId: string) => {
    completeMilestone(msId, {
      onSuccess: () => toast.success('Milestone completed!'),
      onError: () => toast.error('Failed to update milestone'),
    });
  };

  const handleDeleteMilestone = (msId: string) => {
    deleteMilestone(msId, {
      onSuccess: ()=> {
        toast.success('Deleted milestone successfully.')
      },
      onError: (error)=>{
        toast.error(error.message)
      }
    })
  }


  if (loading) {
    return (
      <Box>
        <Skeleton width={120} height={36} sx={{ mb: 2 }} />
        <Skeleton width="50%" height={40} sx={{ mb: 1 }} />
        <Skeleton width="30%" height={24} sx={{ mb: 3 }} />
        <Skeleton height={8} sx={{ mb: 3, borderRadius: 4 }} />
        <Skeleton height={200} variant="rounded" />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">Project not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/projects')}>Back to Projects</Button>
      </Box>
    );
  }

  const { bg, color } = statusColors[project.status];
  const activity = [
    { text: `Project "${project.title}" created`, time: 'Project start' },
    ...milestones.filter(m => m.is_completed).map(m => ({
      text: `Milestone "${m.name}" completed`,
      time: m.completed_at ? new Date(m.completed_at).toLocaleDateString() : '',
    })),
  ];

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 2, color: 'text.secondary', pl: 0 }}
      >
        Projects
      </Button>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" fontWeight={700}>{project.title}</Typography>
            <Chip label={project.status} size="small" sx={{ bgcolor: bg, color, fontWeight: 600 }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Client: {project.clients?.name || 'Unknown'}
            {/* {project. && ` · Due ${new Date(project.deadline).toLocaleDateString()}`} */}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ReceiptRounded />}
          onClick={()=> setOpenInvoiceModal(true)} 
        >
          Create invoice
        </Button>
      </Box>

      {/* Progress */}
      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>Progress</Typography>
            <Typography variant="body2" color="text.secondary">
              {completedCount}/{milestones.length} milestones
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={progress}
            sx={{ height: 8, borderRadius: 4, bgcolor: '#F0F0F0' }}
          />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Milestones */}
        <Box sx={{ flex: 3 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{
                px: 2.5, py: 2, borderBottom: '1px solid #F0F0F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Milestones
                </Typography>
                <Button size="small" startIcon={<AddRounded />} onClick={() => setOpenMilestoneModal(true)}>
                  Add
                </Button>
              </Box>

              {milestones.length === 0 ? (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <FlagRounded sx={{ fontSize: 40, color: '#E0E0E0', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">No milestones yet</Typography>
                  <Button
                    size="small" startIcon={<AddRounded />} sx={{ mt: 1 }}
                  >
                    Add milestone
                  </Button>
                </Box>
              ) : (
                <List disablePadding>
                  {milestones.map((ms, idx) => (
                    <React.Fragment key={ms.id}>
                      <ListItem sx={{ px: 2.5, py: 1.5 }}>
                        <Checkbox
                          checked={ms.is_completed}
                          onChange={() => !ms.is_completed && handleCompleteMilestone(ms.id)}
                          icon={<RadioButtonUncheckedRounded />}
                          checkedIcon={<CheckCircleRounded />}
                          sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'primary.main' }, mr: 0.5 }}
                        />
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2" fontWeight={500}
                              sx={{ textDecoration: ms.is_completed ? 'line-through' : 'none', color: ms.is_completed ? 'text.secondary' : 'text.primary' }}
                            >
                              {ms.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              NPR {ms.amount.toLocaleString()}
                              {ms.due_date && ` · Due ${new Date(ms.due_date).toLocaleDateString()}`}
                            </Typography>
                          }
                        />
                        {ms.is_completed && (
                          <Chip label="Done" size="small" color="success" sx={{ height: 20 }} />
                        )}
                        {!ms.is_completed && (
                          <IconButton onClick={()=>handleDeleteMilestone(ms.id)}>
                            <DeleteRounded/>
                          </IconButton>
                        )}
                      </ListItem>
                      {idx < milestones.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Activity Log */}
        <Box sx={{ flex: 2 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F0F0F0' }}>
                <Typography variant="subtitle1" fontWeight={600}>Activity Log</Typography>
              </Box>
              <Box sx={{ p: 2, position: 'relative' }}>
                {activity.map((a, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: i < activity.length - 1 ? 2 : 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                      {i < activity.length - 1 && (
                        <Box sx={{ width: 1, flex: 1, bgcolor: '#E5E7EB', mt: 0.5 }} />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{a.text}</Typography>
                      <Typography variant="caption" color="text.secondary">{a.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {openMilestoneModal && <MilestoneModalForm projectId={id}/>}

      {openInvoiceModal && <InvoiceModalForm client_id={project.client_id} project_data={project} milestone_data={milestones}/>}

     

      
    </Box>
  );
};
