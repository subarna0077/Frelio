
import { Button, Box } from '@mui/material'
import { AddClientModal } from '../../clients/components/AddClientModal'
import { useClientStore } from '../../clients/stores/ClientStore'
export const Dashboard = () => {
  const setOpenModal = useClientStore(state => state.setOpenModal)
  const openModal = useClientStore(state=> state.openModal)
  return (
    <Box>
      <Button onClick={() => setOpenModal(true)}>Create new client</Button>
     {openModal && <AddClientModal />}
    </Box>
  )
}

