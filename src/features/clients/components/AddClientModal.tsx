import { Dialog, Box, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material'
import { useClientStore } from '../stores/ClientStore'
import { useForm } from 'react-hook-form'
import { type ClientFormType, ClientAddSchema } from '../types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateClient } from '../hooks/useCreateClient'

export const AddClientModal = () => {
    const openModal = useClientStore(state => state.openModal)
    const setOpenModal = useClientStore(state => state.setOpenModal)
    const { mutate: createClient } = useCreateClient()
    const handleClose = () => {
        setOpenModal(false)
    }

    const { register, handleSubmit, formState: {
        errors
    } } = useForm<ClientFormType>({
        resolver: zodResolver(ClientAddSchema)
    })

    const onSubmit = (data: ClientFormType) => {
        createClient(data)
    }


    return (
        <div>
            <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>

                    <DialogTitle>Add Client</DialogTitle>

                    <DialogContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 1
                        }}
                    >
                        <TextField error={!!errors.name} helperText={errors.name?.message} {...register('name')} label="Client Name" fullWidth />

                        <TextField error={!!errors.address} helperText={errors.address?.message} {...register('address')} label="Address" fullWidth />

                        <TextField error={!!errors.phone} helperText={errors.phone?.message} {...register('phone')} label="Phone Number" fullWidth />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button variant="contained" type='submit'>
                            Save
                        </Button>
                    </DialogActions>
                </Box>

            </Dialog>

        </div>
    )
}

