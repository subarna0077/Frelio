import { useState } from 'react';
import {
  Box, Button, Typography, IconButton, Menu, MenuItem,
  Skeleton, Chip, Tooltip,
} from '@mui/material';
import {
  AddOutlined,
  MoreVertRounded,
  FolderOpenOutlined,
  PersonOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useGetProjects } from '../hooks/useGetProjects';
import type { Project, ProjectStatus } from '../types/types';
import toast from 'react-hot-toast';
import { AddProjectModal } from '../components/AddProjectModal';
import { useProjectStore } from '../stores/ProjectStore';
import { useDeleteProject } from '../hooks/useDeleteProject';
import { useWarningDialogStore } from '../../../shared/hooks/useWarningDialogStore';
import { WarningDialog } from '../../../shared/components/WarningDialog';
import { useGetClients } from '../../clients/hooks/useGetClients';
import { useClientStore } from '../../clients/stores/ClientStore';
import { AddClientModal } from '../../clients/components/AddClientModal';


const statusChip: Record<ProjectStatus, { bgcolor: string; color: string; label: string }> = {
  active:    { bgcolor: '#E1F5EE', color: '#0F6E56', label: 'Active' },
  completed: { bgcolor: '#F1EFE8', color: '#5F5E5A', label: 'Completed' },
  'on_hold': { bgcolor: '#FAEEDA', color: '#854F0B', label: 'On hold' },
  'cancelled': {bgcolor: '#f8bcbc', color: '#85110b', label: 'Cancelled'},
};

// ── page ──────────────────────────────────────────────────────────────────────

export const ProjectsPage = () => {
  const openProjectModal = useProjectStore(state => state.openModal);
  const setOpenProjectModal = useProjectStore(state => state.setOpenModal);


  const openClientAddModal = useClientStore(state => state.openModal)
  const setOpenClientAddModal = useClientStore(state => state.setOpenModal)

  const warningType = useWarningDialogStore(state => state.type);
  const setWarningType = useWarningDialogStore(state => state.setType);

  const navigate = useNavigate();
  const { data: projects = [], isLoading: loading } = useGetProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const { data: clients } = useGetClients()

  console.log(projects)

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProject(null);
  };

  const handleEdit = () => {
    setMenuAnchor(null);
    setOpenProjectModal(true);
  };

  const handleDelete = () => {
    setWarningType('delete');
    setMenuAnchor(null);
  };

  const handleConfirm = () => {
    if (!selectedProject?.id) return;
    deleteProject(selectedProject.id, {
      onSuccess: () => {
        toast.success('Project deleted.');
        setSelectedProject(null);
        setWarningType('none');
      },
      onError: () => {
        toast.error('Error deleting project.');
      },
    });
  };

  const handleCancel = () => setWarningType('none');
  const resetForm = () => setSelectedProject(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Projects</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>
            {projects.length} total project{projects.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <Tooltip title={clients?.length === 0 ? "Add a client first before adding a project" : ''}>

          <span>
            <Button
              variant="contained"
              startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
              onClick={() => setOpenProjectModal(true)}
              sx={{ fontSize: 13 }}
              disabled={clients?.length === 0}
            >
              New project
            </Button>

          </span>

        </Tooltip>


      </Box>

      {/* Project list */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3].map(i => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1.5, flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" height={16} />
                  <Skeleton width="25%" height={13} sx={{ mt: 0.5 }} />
                </Box>
                <Skeleton width={60} height={22} variant="rounded" sx={{ borderRadius: 999 }} />
              </Box>
            ))}
          </Box>
        ) : projects.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center', px: 2.5 }}>
            <FolderOpenOutlined sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />

            {clients?.length === 0 ?
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>You cannot add a project before adding client.</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', mt: 0.5, mb: 2 }}>Add your first client.</Typography>

                <Button
                  variant='contained'
                  sx={{ fontSize: 13 }}
                  onClick={() => setOpenClientAddModal(true)}
                >Add client</Button>

              </> :
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                  No projects yet
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5, mb: 2 }}>
                  Create your first project to start tracking work
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
                  onClick={() => setOpenProjectModal(true)}
                  sx={{ fontSize: 13 }}
                >
                  New project
                </Button>
              </>}

          </Box>
        ) : (
          projects.map((project, idx) => {
            const chip = statusChip[project.status];
            return (
              <Box
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  cursor: 'pointer',
                  borderBottom: idx < projects.length - 1 ? '0.5px solid' : 'none',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                {/* Icon box */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: '#E1F5EE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FolderOpenOutlined sx={{ fontSize: 15, color: '#0F6E56' }} />
                </Box>

                {/* Title + client */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }} noWrap>
                    {project.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                    <PersonOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                      {project.clients?.name ?? 'No client'}
                    </Typography>
                  </Box>
                </Box>

                {/* Status chip */}
                <Chip
                  label={chip.label}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: 11,
                    fontWeight: 500,
                    bgcolor: chip.bgcolor,
                    color: chip.color,
                    '& .MuiChip-label': { px: 1.25 },
                    flexShrink: 0,
                  }}
                />

                {/* Actions */}
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    setMenuAnchor(e.currentTarget);
                    setSelectedProject(project);
                  }}
                  sx={{ color: 'text.disabled', flexShrink: 0 }}
                >
                  <MoreVertRounded sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 140,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ fontSize: 13 }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: 13, color: 'error.main' }}>Delete</MenuItem>
      </Menu>

      {openProjectModal && (
        <AddProjectModal initialData={selectedProject} resetForm={resetForm} />
      )}

      {openClientAddModal && (
        <AddClientModal />
      )}

      {warningType === 'delete' && (
        <WarningDialog
          title="Delete project"
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          message="Are you sure you want to delete this project? This cannot be undone."
        />
      )}
    </Box>
  );
};