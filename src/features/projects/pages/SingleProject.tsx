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
  ListItemText,
  Paper,
  Menu,
  IconButton,
  MenuItem
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
import {useState} from 'react'

export const SingleProject = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const openModal = useMilestoneStore(state => state.openModal)
  const setOpenModal = useMilestoneStore(state => state.setOpenModal)
  const { data: milestones } = useListMilestones(id ?? '');
  const { data: project, isLoading } = useGetSingleProject(id ?? '')
  const {mutate: deleteMilestone} = useDeleteMilestone();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)


  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>)=>{
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
    console.log(e)
  }

  

  const handleMenuClose = ()=>{
    setAnchorEl(null)
  }

  console.log(anchorEl)


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

        <Button startIcon={<EditIcon />} variant="contained">
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
                onClick={() => setOpenModal(true)}
              >
                Add Milestone
              </Button>
            </Stack>

            {(milestones ?? []).length > 0 ? <Paper variant="outlined">
              <List>
                {milestones?.map(milestone =>
                <>
                   <ListItem key={milestone.id} divider>
                    <ListItemText primary={milestone.name} />
                    <IconButton size='small' onClick={handleMenuOpen}>
                      <MoreVert fontSize='small' />
                    </IconButton>
                  </ListItem>

                  <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem>
                      Edit
                    </MenuItem>

                    <MenuItem onClick={()=> deleteMilestone(milestone.id)}>
                      Delete
                    </MenuItem>

                  </Menu>
                </>
               
                
                )}


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

        </CardContent>
      </Card>

      {openModal && <MilestoneModalForm project_id={project?.id} />}
    </Box>
  )
}