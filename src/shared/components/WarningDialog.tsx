import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material'

import { useWarningDialogStore } from '../hooks/useWarningDialogStore'

interface WarningDialogProps  {
    onConfirm: ()=> void,
    onCancel: ()=> void,
    warningMsg?: string,
}

export const WarningDialog = ({onConfirm, onCancel, warningMsg}: WarningDialogProps) => {

    const openWarningDialog = useWarningDialogStore(state=> state.openModal)
    const setOpenWarningDialog = useWarningDialogStore(state=> state.setOpenModal)

    console.log(warningMsg)

  return (

    <Dialog open={openWarningDialog} onClose={()=> setOpenWarningDialog(false)}>
        <DialogTitle>
            Update status
        </DialogTitle>

        <DialogContent>
             You have some unfinished Milestones. Do u want to still proceed with completing project?
        </DialogContent>

        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant='contained' color='error' onClick={onConfirm}>Confirm</Button>
        </DialogActions>

    </Dialog>
    
  )
}

