import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

import { useWarningDialogStore } from '../hooks/useWarningDialogStore'

interface WarningDialogProps {
    handleConfirm: () => void,
    handleCancel: () => void,
    title?: string,
    message?: string,
}

export const WarningDialog = ({ handleConfirm, handleCancel, message, title }: WarningDialogProps) => {

    const setType = useWarningDialogStore(state => state.setType)


    return (

        <Dialog open onClose={() => setType('none')}>
            <DialogTitle>
                {title ? title : 'Update status'}
            </DialogTitle>

            <DialogContent>
                {message}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' color='error' onClick={handleConfirm}>Confirm</Button>
            </DialogActions>

        </Dialog>

    )
}

