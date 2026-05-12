import {Button} from '@mui/material'
import { useProjectStore } from '../stores/ProjectStore'
import { AddProjectModal } from '../components/AddProjectModal'
import { useGetProjects } from '../hooks/useGetProjects'
import {List, ListItem, ListItemButton, ListItemText} from '@mui/material'
import {useNavigate} from 'react-router-dom'
export const Projects = () => {

    const setModal = useProjectStore(state=> state.setOpenModal) 
    const openModal = useProjectStore(state=> state.openModal)

    const navigate = useNavigate()

    const {data: projects} = useGetProjects()
    console.log(projects)

    

  return (
    <div>
        Welcome to projects page

        <Button onClick={()=> setModal(true)}>Add new project</Button>
        {openModal && <AddProjectModal/>}

        <List>
          {projects?.map(
            project=> 
            <ListItem key={project.id}>
              <ListItemButton onClick={()=> navigate(`/projects/${project.id}`)} >
                <ListItemText>{project.title}</ListItemText>
              </ListItemButton>

            </ListItem>

          )}
        </List>

        
      
    </div>
  )
}

