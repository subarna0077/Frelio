import {
    Dialog,
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MilestoneAddSchema } from '../types/types'
import type{ MilestoneFormType } from '../types/types'
import { useCreateMilestone } from '../hooks/useCreateMilestone'
import { useMilestoneStore } from '../stores/milestoneStore'


// ── Props ────────────────────────────────────────────────────────────
// interface MilestoneModalFormProps {
//     open: boolean
//     onClose: () => void
//     onSubmit: (data: MilestoneFormType) => void
//     isLoading?: boolean
// }

// ── Component ────────────────────────────────────────────────────────
export const MilestoneModalForm = ({project_id}: {project_id: string}) => {

    const openModal = useMilestoneStore(state=> state.openModal)
    const setOpenModal = useMilestoneStore(state=> state.setOpenModal)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<MilestoneFormType>({
        resolver: zodResolver(MilestoneAddSchema)
    })

    const {mutate: createMilestone, isError, isPending} = useCreateMilestone(project_id)

    const handleClose = () => {
        reset()  
        setOpenModal(false)
        
    }

    const handleFormSubmit = (data: MilestoneFormType) => {
         createMilestone(data);
         reset();
         setOpenModal(false)
    }

    return (
        <Dialog open={true} onClose={handleClose} onSubmit={handleSubmit(handleFormSubmit)} fullWidth maxWidth="sm">
            <Box component="form">

                <DialogTitle>Add Milestone</DialogTitle>

                <DialogContent>
                    <Stack sx={{gap:2, mt:1}}>

                        {/* Milestone name */}
                        <TextField
                            label="Milestone name"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            placeholder="e.g. Design mockup"
                            {...register('name')}
                        />

                        {/* Amount */}
                        <TextField
                            label="Amount (Rs)"
                            fullWidth
                            type="number"
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                            placeholder="e.g. 10000"
                            {...register('amount', {
                                valueAsNumber: true
                            })}
                        />

                        {/* Due date (optional) */}
                        <TextField
                            label="Due date (optional)"
                            fullWidth
                            type="date"
                            error={!!errors.due_date}
                            helperText={errors.due_date?.message}
                            //InputLabelProps={{ shrink: true }}
                            {...register('due_date')}
                        />

                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        //disabled={isLoading}
                    >
                        Save
                    </Button>
                </DialogActions>

            </Box>
        </Dialog>
    )
}