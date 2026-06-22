import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, CircularProgress, IconButton,
  InputAdornment, Typography,
} from '@mui/material'
import { CloseRounded } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useMilestoneStore } from '../stores/milestoneStore'
import { useForm } from 'react-hook-form'
import type { MilestoneFormType } from '../types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { MilestoneAddSchema } from '../types/types'
import { useCreateMilestone } from '../hooks/useCreateMilestone'

export interface MilestoneModalProps {
  projectId?: string
}

export const MilestoneModalForm = ({ projectId }: MilestoneModalProps) => {
  const setOpenMilestoneModal = useMilestoneStore(state => state.setOpenModal)
  const openMilestoneModal    = useMilestoneStore(state => state.openModal)

  const { mutate: createMilestone, isPending: creatingMilestone } = useCreateMilestone(projectId)

  const { register, reset, handleSubmit, formState: { errors } } = useForm<MilestoneFormType>({
    resolver: zodResolver(MilestoneAddSchema),
  })

  const handleClose = () => setOpenMilestoneModal(false)

  const onSubmit = (data: MilestoneFormType) => {
    createMilestone(data, {
      onSuccess: () => {
        toast.success('Milestone created successfully.')
        reset()
        setOpenMilestoneModal(false)
      },
      onError: (error) => toast.error(error.message),
    })
  }

  // Shared field styling — matches the app's light outlined look
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      fontSize: 13,
      borderRadius: 1.5,
      '& fieldset': { borderColor: 'divider' },
      '&:hover fieldset': { borderColor: 'text.disabled' },
      '&.Mui-focused fieldset': { borderColor: 'text.primary', borderWidth: 1 },
    },
    '& .MuiInputLabel-root': {
      fontSize: 13,
      color: 'text.disabled',
      '&.Mui-focused': { color: 'text.primary' },
    },
    '& .MuiFormHelperText-root': { fontSize: 11, mt: 0.5 },
  }

  return (
    <Dialog
      open={openMilestoneModal}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 2.5 },
            m: { xs: 0, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            maxHeight: '100dvh',
          },
        },
      }}
    >
      {/* ── header ─────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 2,
          borderBottom: '0.5px solid', borderColor: 'divider',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>
            Add milestone
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
            Break the project into trackable deliverables
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'text.disabled', ml: 1 }}>
          <CloseRounded sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>

      {/* ── body ───────────────────────────────────────────────────────── */}
      <DialogContent sx={{ px: 2.5, py: 2.5 }}>
        <Box
          component="form"
          id="milestone-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            placeholder="e.g. Initial wireframes"
            fullWidth
            autoFocus
            size="small"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={fieldSx}
          />

          <TextField
            label="Description"
            placeholder="Short summary of what this milestone covers"
            fullWidth
            size="small"
            multiline
            rows={2}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={fieldSx}
          />

          {/* Amount + Due date side by side on sm+ */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              label="Amount"
              type="number"
              size="small"
              fullWidth
              {...register('amount', { valueAsNumber: true })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>NPR</Typography>
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />
            <TextField
              label="Due date"
              type="date"
              size="small"
              fullWidth
              {...register('due_date')}
              error={!!errors.due_date}
              helperText={errors.due_date?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* ── footer ─────────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 2.5, pb: 2.5, pt: 0, gap: 1,
          borderTop: '0.5px solid', borderColor: 'divider',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          size="small"
          sx={{ fontSize: 13, color: 'text.secondary', borderColor: 'divider' }}
        >
          Cancel
        </Button>
        <Button
          form="milestone-form"
          type="submit"
          variant="contained"
          size="small"
          sx={{ fontSize: 13, minWidth: 120 }}
        >
          {creatingMilestone
            ? <CircularProgress size={16} sx={{ color: '#fff' }} />
            : 'Create milestone'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}