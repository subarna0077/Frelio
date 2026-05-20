import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, CircularProgress, IconButton,
    InputAdornment,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useMilestoneStore } from '../stores/milestoneStore';
import { useForm } from 'react-hook-form'
import type { MilestoneFormType } from '../types/types';
import { zodResolver } from '@hookform/resolvers/zod'
import { MilestoneAddSchema } from '../types/types';
import { useCreateMilestone } from '../hooks/useCreateMilestone';


export interface MilestoneModalProps {
    projectId?: string
}

export const MilestoneModalForm = ({projectId}: MilestoneModalProps) => {
    const setOpenMilestoneModal = useMilestoneStore(state => state.setOpenModal)
    const openMilestoneModal = useMilestoneStore(state => state.openModal)

    const {mutate: createMilestone, isPending: creatingMilestone} = useCreateMilestone(projectId)

    const { register, reset, handleSubmit, formState: {
        errors
    } } = useForm<MilestoneFormType>({
        resolver: zodResolver(MilestoneAddSchema)
    })

    const handleClose = () => {
        setOpenMilestoneModal(false)
    }

    const onSubmit = (data: MilestoneFormType) => {
        console.log(data);
        createMilestone(data, {
            onSuccess: ()=>{
                toast.success('Milestone created successfully.')
                reset()
                setOpenMilestoneModal(false)
            },
            onError: (error)=> {
                toast.error(error.message)
            }
        });
        

    }




    return (
        <Dialog open={openMilestoneModal} onSubmit={handleSubmit(onSubmit)} onClose={handleClose} maxWidth="sm" fullWidth component="form">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                Add Milestone
                <IconButton size="small" onClick={handleClose} ><CloseRounded fontSize="small" /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Milestone name *"
                        fullWidth autoFocus
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        label="Amount *"
                        type="number"
                        {...register('amount', {
                            valueAsNumber: true
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position='start'>NPR</InputAdornment>
                            }
                        }}
                    />
                    <TextField
                        label="Due date"
                        type="date"
                        fullWidth
                        {...register('due_date')}
                        error={!!errors.due_date}
                        helperText={errors.due_date?.message}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ color: 'text.secondary', borderColor: '#E0E0E0' }}>
                    Cancel
                </Button>
                <Button variant="contained" type='submit'>
                    {creatingMilestone ? <CircularProgress size={18} sx={{
                        color: '#fff'
                    }}></CircularProgress>: 'Create milestone'}
                    
                </Button>
            </DialogActions>
        </Dialog>
    );
};
