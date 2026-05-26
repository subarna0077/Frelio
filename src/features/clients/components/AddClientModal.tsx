import { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { useClientStore } from '../stores/ClientStore';
import { useForm } from 'react-hook-form'
import type { Client, ClientFormType } from '../types/types';
import { ClientAddSchema } from '../types/types';
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateClient } from '../hooks/useCreateClient';
import { toast } from 'react-hot-toast'
import { useEditClient } from '../hooks/useEditClient';



type AddClientModalProps = {
  initialData?: Client | null;
  resetOnClose: () => void;
}

export const AddClientModal = ({ initialData, resetOnClose }: AddClientModalProps) => {
  const open = useClientStore(state => state.openModal)
  const setOpenModal = useClientStore(state => state.setOpenModal)

  const { mutate: createClient } = useCreateClient()
  const { mutate: editClient } = useEditClient();

  const { register, reset, handleSubmit, formState: {
    errors
  } } = useForm<ClientFormType>({
    resolver: zodResolver(ClientAddSchema),
  })

  const handleFormClose = () => {
    setOpenModal(false);
    reset({ name: '', address: '', phone: '', email: '' })
    resetOnClose();
  }



  const onSubmit = (data: ClientFormType) => {

    if (initialData) {
      editClient({
        id: initialData.id,
        formData: data
      }, {
        onSuccess: () => {
          toast.success('User edited successfully.')
          handleFormClose();

        },
        onError: () => {
          toast.error(
            'Error occured on editing.'
          )
        }
      })
    }
    else {
      createClient(data, {
        onSuccess: () => {
          toast.success('User created successfully.')
          handleFormClose();
        },
        onError: () => {
          toast.error('Error occured on creating.')
        }
      })
    }
  }

  useEffect(() => {
    reset({
      name: initialData?.name ?? '',
      address: initialData?.address ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? ''
    })

  }, [initialData, reset])

  return (
    <Dialog open={open} onClose={handleFormClose} maxWidth="sm" fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        {initialData ? 'Edit client' : 'Create client'}
        <IconButton size="small" onClick={handleFormClose}><CloseRounded fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} >
          <TextField label="Name *" {...register('name')} error={!!errors.name} helperText={errors.name?.message} fullWidth autoFocus />
          <TextField label="Phone *" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} fullWidth />
          <TextField label="Address *" {...register('address')} error={!!errors.address} helperText={errors.address?.message} fullWidth multiline rows={2} />
          <TextField label="Email *" {...register('email')} error={!!errors.email} helperText={errors.email?.message} fullWidth multiline rows={2} />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" color="inherit" sx={{ color: 'text.secondary', borderColor: '#E0E0E0' }} onClick={handleFormClose}>
          Cancel
        </Button>
        <Button variant="contained" disabled={false} type='submit'>
          Submit
          {/* {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : client ? 'Save changes' : 'Add client'} */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
