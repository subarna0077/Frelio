import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSingleProject } from '../hooks/useGetSingleProject'

export const SingleProject = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <Typography>Project not found</Typography>
  }

  const { data: project, isLoading } = useGetSingleProject(id)
  console.log(project)

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Top Section */}
      <Stack sx={{
        direction: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb:3
      }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          variant="outlined"
        >
          Back
        </Button>

        <Button
          startIcon={<EditIcon />}
          variant="contained"
        >
          Edit Project
        </Button>
      </Stack>

      {/* Main Card */}
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Title */}
          <Typography variant="h4" sx={{fontWeight: 'bold'}}>
            {project?.title}
          </Typography>

          {/* Status + Priority */}
          <Stack sx={{direction:"row", spacing:2 ,mb:3}}>
            <Chip label="In Progress" color="primary" />
            <Chip label="High Priority" color="error" />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Description */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Title
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {project?.title ||
                'No description added for this project.'}
            </Typography>
          </Box>

          {/* Details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>

            <Stack spacing={2} mt={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Project ID
                </Typography>

                <Typography>{project?.id}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>

                <Typography>
                  {project?.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Client
                </Typography>

                <Typography>{project?.clients.name}</Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}