import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, CircularProgress, IconButton,
    MenuItem,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import type { Client } from '../../clients/types/types';
import type { Project, ProjectDataType } from '../types/types';
import { useGetClients } from '../../clients/hooks/useGetClients';
import { useForm, Controller } from 'react-hook-form'
import { useCreateProject } from '../hooks/useCreateProject';
import { toast } from 'react-hot-toast'
import { useProjectStore } from '../stores/ProjectStore';
import { useEditProject } from '../hooks/useEditProject';

interface AddProjectModalProps {
    initialData?: Project | null,
    resetForm: () => void;
}


export const AddProjectModal = ({ initialData, resetForm }: AddProjectModalProps) => {
    const { register, control, reset, handleSubmit } = useForm<ProjectDataType>()
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const { mutate: createProject } = useCreateProject(selectedClient?.id)
    const { mutate: editProject } = useEditProject(initialData?.id);

    const open = useProjectStore(state => state.openModal)
    const setOpenModal = useProjectStore(state => state.setOpenModal)


    const handleFormClose = () => {
        setOpenModal(false);
        resetForm()
        setSelectedClient(null)
    }

    const onSubmit = (data: ProjectDataType) => {

        if (!selectedClient?.id) {
            toast.error('Please select a client')
            return
        }

        if (initialData) {
            editProject(data, {
                onSuccess: () => {
                    toast.success('Edited successfully')
                    handleFormClose()
                },
                onError: (error) => {
                    toast.error(error.message)
                }
            })
        } else {
            createProject(data, {
                onSuccess: () => {
                    toast.success('Project created successfully.')
                    handleFormClose()
                }
            })
        }

    };

    useEffect(() => {
        reset({
            title: initialData?.title ?? '',
            status: initialData?.status ?? ''
        })

    }, [initialData, reset])

    const { data: clients } = useGetClients();
    return (
        <Dialog open={open} onClose={handleFormClose} maxWidth="sm" fullWidth component="form" onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                {initialData ? 'Edit Project' : 'Add New Project'}
                <IconButton size="small" onClick={handleFormClose}><CloseRounded fontSize="small" /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Project name *" fullWidth autoFocus {...register('title')} />
                    <TextField select label="Client *" fullWidth value={selectedClient?.id ?? ''}>
                        {clients?.length === 0
                            ? <MenuItem disabled>No clients available</MenuItem>
                            : clients?.map(c => <MenuItem key={c.id} value={c.id} onClick={() => setSelectedClient(c)}>{c.name}</MenuItem>)
                        }
                    </TextField>

                    <Controller name='status' control={control} render={({ field }) => (
                        <TextField {...field} select label="Status" fullWidth>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="on-hold">On Hold</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </TextField>

                    )} />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button variant="outlined" color="inherit" sx={{ color: 'text.secondary', borderColor: '#E0E0E0' }} onClick={() => {
                    reset({
                        status: '',
                        title: ''
                    })
                    handleFormClose()
                }}>
                    Cancel
                </Button>
                <Button variant="contained" type='submit'>
                    {initialData ? 'Edit project': 'Create project'}
                    {/* {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : project ? 'Save changes' : 'Create project'} */}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
