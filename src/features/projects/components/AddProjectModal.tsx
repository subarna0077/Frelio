import { useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, IconButton, MenuItem, Typography,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
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
    clientPrefillId?: string;
}



export const AddProjectModal = ({ initialData, resetForm, clientPrefillId }: AddProjectModalProps) => {
    const { register, reset, handleSubmit, setValue, formState: {
        errors
    } } = useForm<ProjectDataType>({
        resolver: zodResolver(AddProjectSchema),
    });

    const { mutate: createProject } = useCreateProject();
    const { mutate: editProject } = useEditProject(initialData?.id);
    const { data: clients } = useGetClients();

    const open = useProjectStore(state => state.openModal);
    const setOpenModal = useProjectStore(state => state.setOpenModal);


    const handleFormClose = () => {
        setOpenModal(false);
        resetForm?.();
    };



    const onSubmit = (data: ProjectDataType) => {

        if (initialData) {
            editProject(data, {
                onSuccess: () => { toast.success('Project updated.'); handleFormClose(); },
                onError: (error) => toast.error(error.message),
            });
        } else {
            createProject(data, {
                onSuccess: () => { toast.success('Project created.'); handleFormClose(); },
                onError: (error) => toast.error(error.message),
            });
        }
    };

    useEffect(() => {
        reset({
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            start_date: initialData?.start_date ?? '',
            due_date: initialData?.due_date ?? '',
            client_id: initialData?.client_id ?? ''
        });
    }, [initialData, reset]);

  

    useEffect(() => {

        if (clientPrefillId) {
            setValue(
                'client_id', clientPrefillId
            )
        }

    }, [clientPrefillId])

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
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        minRows={2}
                        size="small"
                        {...register('description')}
                        slotProps={{ inputLabel: { sx: { fontSize: 13 } }, input: { sx: { fontSize: 13 } } }}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    {!isEdit && !clientPrefillId && (
                        <TextField
                            label="Select client"
                            select
                            fullWidth
                            size="small"
                            error={!!errors.client_id}
                            helperText={errors.client_id?.message}
                            {...register('client_id')}
                        >
                            {clients?.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    {isEdit && (
                        <TextField
                            label="Select client"
                            select
                            fullWidth
                            size="small"
                            disabled
                            value={initialData?.client_id ?? ''}
                        >
                            <MenuItem value={initialData?.client_id ?? ''}>
                                {clients?.find(c => c.id === initialData?.client_id)?.name ?? ''}
                            </MenuItem>
                        </TextField>
                    )}



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
                        reset({ title: '', description: '', start_date: '', due_date: '', client_id: '' });
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