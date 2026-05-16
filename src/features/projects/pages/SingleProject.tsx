import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Menu,
  IconButton,
  MenuItem,
  Checkbox
} from '@mui/material'

import { MoreVert } from '@mui/icons-material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSingleProject } from '../hooks/useGetSingleProject'
import { MilestoneModalForm } from '../../milestone/components/MilestoneModalForm'
import { useMilestoneStore } from '../../milestone/stores/milestoneStore'
import { useListMilestones } from '../../milestone/hooks/useListMilestones'
import { useDeleteMilestone } from '../../milestone/hooks/useDeleteMilestone'
import { AddProjectModal } from '../components/AddProjectModal'
import { useProjectStore } from '../stores/ProjectStore'
import type { Milestone, MilestoneFormType } from '../../milestone/types/types'
import {useState} from 'react'
import { useCompleteMilestone } from '../../milestone/hooks/useCompleteMilestone'

import { InvoiceModalForm } from '../../invoice/components/InvoiceModalForm'
import { useInvoiceStore } from '../../invoice/stores/InvoiceStore'

export const SingleProject = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const openMilestoneModal = useMilestoneStore(state => state.openModal)
  const setOpenMilestoneModal = useMilestoneStore(state => state.setOpenModal)
  const { data: milestones } = useListMilestones(id ?? '');
  const { data: project, isLoading } = useGetSingleProject(id ?? '')
  console.log(project)
  const { mutate: deleteMilestone } = useDeleteMilestone();
  const {mutate: completeMilestone} = useCompleteMilestone();
  const openProjectModal = useProjectStore(state => state.openModal)
  const setOpenProjectModal = useProjectStore(state => state.setOpenModal)

  const openInvoiceModal = useInvoiceStore(state=> state.openModal)
  const setOpenInvoiceModal = useInvoiceStore(state=> state.setOpenModal)




  const [anchorEl, setAnchorEl] = useState<HTMLElement| null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  const open = Boolean(anchorEl)



  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, milestone: Milestone)=>{
    setAnchorEl(e.currentTarget)
    console.log('Milestone data got when clicking the dot button', milestone)
    setSelectedMilestone(milestone)
   
  }

  const handleMenuClose = ()=>{
    setAnchorEl(null);
    setSelectedMilestone(null)
    console.log('Handle menu close fired.')
  }


  const handleMilestoneDelete = (milestone_id: string)=>{
    deleteMilestone(milestone_id)
  }

  const handleCompleteMilestone = (milestone_id: string)=>{
    completeMilestone(milestone_id)

  }


  if (!id) {
    return <Typography>Id is not found</Typography>
  }
  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (!project) return <p>This project might have been deleted or altered.</p>



  return (
    <Box sx={{ minHeight: '100vh', p: 4, bgcolor: '#f5f5f5' }}>

      {/* Top Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          variant="outlined"
        >
          Back
        </Button>

        <Button startIcon={<EditIcon />} variant="contained" onClick={() => setOpenProjectModal(true)}>
          Edit Project
        </Button>
      </Stack>

      {/* Main Card */}
      <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Title */}
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {project?.title}
          </Typography>

          {/* Chips */}
          <Stack direction="row" spacing={2} mb={3}>
            <Chip label="In Progress" color="primary" />
            <Chip label="High Priority" color="error" />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Description */}
          <Box mb={4}>
            <Typography variant="h6">Description</Typography>

            <Typography color="text.secondary">
              {project?.description || 'No description added.'}
            </Typography>
          </Box>


          <Box mb={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                Milestones
              </Typography>

              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                onClick={() => setOpenMilestoneModal(true)}
              >
                Add Milestone
              </Button>
            </Stack>

            {(milestones ?? []).length > 0 ? <Paper variant="outlined">
              <List>
                {milestones?.map(milestone =>
                  <ListItem key={milestone.id} divider>
                    <ListItemIcon>
                      <Checkbox checked={milestone.is_completed}>
                      </Checkbox>
                      
                    </ListItemIcon>
                    
                    <ListItemText primary={milestone.name} />
                    <IconButton size='small' onClick={(e)=>handleMenuOpen(e, milestone)}>
                      <MoreVert fontSize='small' />
                    </IconButton>
                  </ListItem>
                )}

                <Menu open={open} onClose={handleMenuClose} anchorEl={anchorEl}>
                  <MenuItem onClick={()=> handleCompleteMilestone(selectedMilestone?.id ?? '')}>
                  Mark as complete
                  </MenuItem>
                  <MenuItem onClick={()=> {
                    console.log('SelectedMilestone at edit click', selectedMilestone)
                    setOpenMilestoneModal(true)
                  }}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={()=>handleMilestoneDelete(selectedMilestone?.id ?? '')}>
                    Delete
                  </MenuItem>

                </Menu>


              </List>
            </Paper> : <Typography color="text.secondary">
              No milestones yet.
            </Typography>}




          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>

            <Stack spacing={2} mt={2}>
              <Box>
                <Typography color="text.secondary">
                  Project ID
                </Typography>
                <Typography>{project?.id}</Typography>
              </Box>

              <Box>
                <Typography color="text.secondary">
                  Created At
                </Typography>
                <Typography>
                  {project?.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography color="text.secondary">
                  Client
                </Typography>
                <Typography>
                  {project?.clients?.name}
                </Typography>
              </Box>
            </Stack>
          </Box>


          <Button onClick={()=> setOpenInvoiceModal(true)}>
            Create invoice
          </Button>

        </CardContent>
      </Card>

      {openMilestoneModal && <MilestoneModalForm project_id={project?.id} initialData={selectedMilestone} />}

      {openProjectModal && <AddProjectModal project_id={project?.id} initialData={project} />}

      {openInvoiceModal && <InvoiceModalForm client_id={project?.client_id} project_data={project} milestone_data={milestones ?? []}/>}
    </Box>
  )
}