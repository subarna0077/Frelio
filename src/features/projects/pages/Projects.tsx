import { Button } from '@mui/material'
import { useProjectStore } from '../stores/ProjectStore'
import { AddProjectModal } from '../components/AddProjectModal'
import { useGetProjects } from '../hooks/useGetProjects'
import { List, ListItem, ListItemButton, ListItemText, IconButton, Menu, MenuItem } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDeleteProject } from '../hooks/useDeleteProject'
export const Projects = () => {

  const setModal = useProjectStore(state => state.setOpenModal)
  const openModal = useProjectStore(state => state.openModal)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

 


  const navigate = useNavigate()

  const { data: projects } = useGetProjects()
  console.log(projects)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const {mutate: deleteProject} = useDeleteProject()

  

  // function ProjectItem({project}: {project: Project}){


  // }




  return (
    <div>
      Welcome to projects page

      <Button onClick={() => setModal(true)}>Add new project</Button>
      {openModal && <AddProjectModal />}

      <List>
        {projects?.map(
          project =>
            <>

              <ListItem key={project.id}>
                <ListItemButton onClick={() => navigate(`/projects/${project.id}`)} >
                  <ListItemText>{project.title}</ListItemText>
                  <IconButton size='small' onClick={handleMenuOpen}>
                    <MoreVert fontSize='small' />

                  </IconButton>
                </ListItemButton>
              </ListItem>

              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem>Edit</MenuItem>
                <MenuItem onClick={()=>deleteProject(project.id)}>Delete</MenuItem>

              </Menu>
            </>

        )}
      </List>





    </div>
  )
}

