import {Button} from '@mui/material'
import { useProjectStore } from '../stores/ProjectStore'
import { AddProjectModal } from '../components/AddProjectModal'
export const Projects = () => {

    const setModal = useProjectStore(state=> state.setOpenModal) 
    const openModal = useProjectStore(state=> state.openModal)
    

  return (
    <div>
        Welcome to projects page

        <Button onClick={()=> setModal(true)}>Add new project</Button>
        {openModal && <AddProjectModal/>}
      
    </div>
  )
}

