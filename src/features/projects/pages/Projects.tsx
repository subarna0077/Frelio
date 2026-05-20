import React, { useState } from 'react';
import {
  Box, Button, Typography, Card, CardContent, List, ListItem,
  ListItemText, IconButton, Menu, MenuItem, Skeleton, Divider,
  Chip, Avatar, ListItemAvatar,
} from '@mui/material';
import { AddRounded, MoreVertRounded, FolderRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProjects } from '../hooks/useGetProjects';
import type { Project } from '../types/types';
import toast from 'react-hot-toast';
import { AddProjectModal } from '../components/AddProjectModal';
import { useProjectStore } from '../stores/ProjectStore';
import { useDeleteProject } from '../hooks/useDeleteProject';


export const ProjectsPage = () => {

  const open = useProjectStore(state => state.openModal)
  const setOpenModal = useProjectStore(state => state.setOpenModal)

  const navigate = useNavigate();
  const { data: projects = [], isLoading: projLoading } = useGetProjects();
  const { mutate: deleteProject } = useDeleteProject()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const loading = projLoading;

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProject(null);
  }

  const handleEdit = () => {
    setMenuAnchor(null);
    setOpenModal(true);
  }

  const handleDelete = () => {
    setMenuAnchor(null);

    if (!selectedProject?.id) return;

    deleteProject(selectedProject.id, {
      onSuccess: () => {
        toast.success('Project deleted successfully.')
        setSelectedProject(null)
      },
      onError: () => {
        toast.error('Error deleting project.')
      }
    })
  }

  const resetForm = () => {
    setSelectedProject(null)
  }


  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Projects</Typography>
          <Typography variant="body2" sx={{
            color: "text.secondary",
            mt: 0.25
          }}>
            {projects.length} total project{projects.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRounded />} onClick={() => setOpenModal(true)}>
          New project
        </Button>
      </Box>

      <Card elevation={0}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[1, 2, 3].map(i => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                  <Skeleton variant="circular" width={44} height={44} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="45%" height={20} />
                    <Skeleton width="30%" height={16} />
                  </Box>
                  <Skeleton width={70} height={24} variant="rounded" />
                </Box>
              ))}
            </Box>
          ) : projects.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <FolderRounded sx={{ fontSize: 52, color: '#E0E0E0', mb: 1.5 }} />
              <Typography variant="subtitle1" color="text.secondary" sx={{fontWeight: 600}} >No projects yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{mt:0.5, mb:2}}>
                Create your first project to start tracking work
              </Typography>
              <Button variant="contained" startIcon={<AddRounded />} onClick={()=>setOpenModal(true)}>
                New project
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {projects.map((project, idx) => {
                // const { bg, color, label } = statusInfo(project.status);
                return (
                  <React.Fragment key={project.id}>
                    <ListItem
                      sx={{
                        px: 2.5, py: 1.5, cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      secondaryAction={
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            setMenuAnchor(e.currentTarget);
                            setSelectedProject(project);
                          }}
                        >
                          <MoreVertRounded fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FolderRounded fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{fontWeight:600}}>{project.title}</Typography>
                            <Chip
                              label={project.status}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={project.client_id || 'No client'}
                        slotProps={{
                          secondary: {
                            variant: 'caption'
                          }
                        }}   
                      />
                    </ListItem>
                    {idx < projects.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* <ProjectModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditProject(null); }}
        onSubmit={handleCreate}
        loading={creating}
        clients={clients}
        project={editProject}
      /> */}

      {open && <AddProjectModal initialData={selectedProject} resetForm={resetForm} />}
    </Box>
  );
};


