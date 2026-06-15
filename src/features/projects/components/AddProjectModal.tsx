import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, IconButton, MenuItem, Typography,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import type { Client } from '../../clients/types/types';
import type { Project, ProjectDataType } from '../types/types';
import { useGetClients } from '../../clients/hooks/useGetClients';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddProjectSchema } from '../types/types';
import { useCreateProject } from '../hooks/useCreateProject';
import { useEditProject } from '../hooks/useEditProject';
import { toast } from 'react-hot-toast';
import { useProjectStore } from '../stores/ProjectStore';

interface AddProjectModalProps {
    initialData?: Project | null;
    resetForm?: () => void;
    source: 'clientPage' | 'projectsPage';
    clientPrefillId?: string;
}



export const AddProjectModal = ({ initialData, resetForm, source, clientPrefillId }: AddProjectModalProps) => {
    const { register, reset, handleSubmit } = useForm<ProjectDataType>({
        resolver: zodResolver(AddProjectSchema),
    });

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const { mutate: createProject } = useCreateProject();
    const { mutate: editProject } = useEditProject(initialData?.id);
    const { data: clients } = useGetClients();

    const open = useProjectStore(state => state.openModal);
    const setOpenModal = useProjectStore(state => state.setOpenModal);


    const handleFormClose = () => {
        setOpenModal(false);
        resetForm?.();
        setSelectedClient(null);
    };



    const onSubmit = (data: ProjectDataType) => {

        const clientId = source === 'clientPage' ? clientPrefillId : selectedClient?.id;

        if (!clientId) {
            toast.error('Please select a client.');
            return;
        }

        if (initialData) {
            editProject(data, {
                onSuccess: () => { toast.success('Project updated.'); handleFormClose(); },
                onError: (error) => toast.error(error.message),
            });
        } else {
            createProject({ ...data, client_id: clientId }, {
                onSuccess: () => { toast.success('Project created.'); handleFormClose(); },
                onError: (error) => toast.error(error.message),
            });
        }
    };

    useEffect(() => {
        reset({
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            project_code: initialData?.project_code ?? '',
            start_date: initialData?.start_date ?? '',
            due_date: initialData?.due_date ?? '',
        });
    }, [initialData, reset]);

    useEffect(() => {
        if (initialData && clients) {
            const found = clients.find(c => c.id === initialData.client_id);
            if (found) setSelectedClient(found);
        }
    }, [initialData, clients]);

    const isEdit = Boolean(initialData);


    return (
        <Dialog
            open={open}
            onClose={handleFormClose}
            maxWidth="sm"
            fullWidth
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            slotProps={{
                paper: {
                    sx: {
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    },
                },
            }}
        >
            {/* Title */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2.5,
                    pt: 2.5,
                    pb: 0,
                }}
            >
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                    {isEdit ? 'Edit project' : 'New project'}
                </Typography>
                <IconButton
                    size="small"
                    onClick={handleFormClose}
                    sx={{ color: 'text.disabled' }}
                >
                    <CloseRounded sx={{ fontSize: 18 }} />
                </IconButton>
            </DialogTitle>

            {/* Fields */}
            <DialogContent sx={{ px: 2.5, pt: 2, pb: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <TextField
                        label="Project title"
                        fullWidth
                        autoFocus
                        size="small"
                        {...register('title')}
                        slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } } }}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        {...register('description')}
                        slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } } }}
                    />

                    {!isEdit ?
                        <TextField
                            label="Select client"
                            select
                            value={selectedClient?.id}
                            onChange={(e) => {
                                // selectedClient is a whole client object
                                const client = clients?.find(c => c.id === e.target.value);
                                if (client) setSelectedClient(client);
                            }}
                        >
                            {clients?.map((c) =>
                                <MenuItem
                                    key={c.id}
                                    value={c.id}
                                >
                                    {c.name}
                                </MenuItem>)}
                        </TextField> :

                        <TextField
                            label="Select client"
                            select
                            disabled
                            value={initialData?.id}
                        >
                            <MenuItem value={initialData?.id}>
                                {clients?.find(c => c.id === initialData?.client_id)?.name ?? ''}
                            </MenuItem>

                        </TextField>




                    }




                    <TextField
                        label="Project code"
                        fullWidth
                        size="small"
                        {...register('project_code')}
                        slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } } }}
                    />


                    {/* Dates — side by side */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField
                            label="Start date"
                            type="date"
                            fullWidth
                            size="small"
                            {...register('start_date')}
                            slotProps={{
                                inputLabel: { shrink: true, sx: { fontSize: 13 } },
                                input: { sx: { fontSize: 13 } },
                            }}
                        />
                        <TextField
                            label="Due date"
                            type="date"
                            fullWidth
                            size="small"
                            {...register('due_date')}
                            slotProps={{
                                inputLabel: { shrink: true, sx: { fontSize: 13 } },
                                input: { sx: { fontSize: 13 } },
                            }}
                        />
                    </Box>

                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions
                sx={{
                    px: 2.5,
                    py: 2,
                    gap: 1,
                    borderTop: '0.5px solid',
                    borderColor: 'divider',
                    mt: 2,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => {
                        reset({ title: '', description: '' });
                        handleFormClose();
                    }}
                    sx={{ fontSize: 13, color: 'text.secondary', borderColor: 'divider' }}
                >
                    Cancel
                </Button>
                <Button variant="contained" type="submit" sx={{ fontSize: 13 }}>
                    {isEdit ? 'Save changes' : 'Create project'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};