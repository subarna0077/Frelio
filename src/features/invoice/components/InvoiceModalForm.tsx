import { useEffect } from 'react';
import {
  Box, Dialog, DialogContent, DialogActions,
  Typography, Stack, TextField,
  IconButton, Button, Chip,
  CircularProgress, Divider,
} from '@mui/material';
import {
  CloseRounded, AddRounded, DeleteOutlineRounded,
  ReceiptRounded,
} from '@mui/icons-material';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInvoiceStore } from '../stores/InvoiceStore';
import { useParams } from 'react-router-dom';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import type { Project } from '../../projects/types/types';
import type { Milestone } from '../../milestone/types/types';
import { toast } from 'react-hot-toast'
import { useUpdateMilestoneStatus } from '../../milestone/hooks/useUpdateMilestoneStatus';

const TAX_RATE = 0.13  // 13% VAT Nepal

// ── Schemas ────────────────────────────────────────────────────────────────

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number({ message: 'Enter a valid amount' }).min(1, 'Must be greater than 0'),
})

export const InvoiceSchema = z.object({
  milestone_id: z.string().uuid(),
  due_date: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(InvoiceItemSchema).min(1, 'Add at least one line item'),
})

export type InvoiceFormType = z.infer<typeof InvoiceSchema>

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  client_id: string
  project_data: Project
  preSelectedMs: Milestone
}

// ── Component ──────────────────────────────────────────────────────────────

export const InvoiceModalForm = ({ client_id, project_data, preSelectedMs }: Props) => {
  const setOpenModal = useInvoiceStore(state => state.setOpenModal)
  const openModal = useInvoiceStore(state => state.openModal)
  const { id: project_id } = useParams()
  const { mutate: createInvoice, isPending } = useCreateInvoice(client_id, project_id)
  const { mutate: updateMs } = useUpdateMilestoneStatus()

  const {
    register, control, handleSubmit, watch, reset,
    formState: { errors },
  } = useForm<InvoiceFormType>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      milestone_id: preSelectedMs?.id,
      due_date: '',
      notes: '',
      items: [{ description: preSelectedMs?.title, amount: preSelectedMs?.amount }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  // re-fill if milestone changes
  useEffect(() => {
    reset({
      milestone_id: preSelectedMs.id,
      due_date: '',
      notes: '',
      items: [{ description: preSelectedMs.title, amount: preSelectedMs.amount }],
    })
  }, [preSelectedMs.id])

  // live calculations
  const watchedItems = watch('items')
  const subtotal = watchedItems?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) ?? 0
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax

  const handleClose = () => {
    setOpenModal(false)
    reset()
  }

  const onSubmit = (data: InvoiceFormType) => {
    createInvoice({
      ...data,
      subtotal,
      tax,
      total,
    }, {
      onSuccess: (data) => {
        updateMs({ milestoneId: preSelectedMs.id, status: 'invoiced', invoiceId: data.id })
        handleClose()
      },
      onError: () => toast.error('Error creating invoice.')
    })
  }

  return (
    <Dialog
      open={openModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'scroll' } } }}
    >


      <Box sx={{ px: 3, pt: 3, pb: 2, bgcolor: '#1D9E75' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ReceiptRounded sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Create Invoice
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                Draft will be saved — send later
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose}
            sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <CloseRounded fontSize="small" />
          </IconButton>
        </Box>

        {/* project + client + milestone pills */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip label={`📁 ${project_data?.title}`} size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 500, fontSize: '0.75rem' }} />
          <Chip label={`👤 ${project_data?.clients?.name}`} size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 500, fontSize: '0.75rem' }} />
          <Chip label={`🚩 ${preSelectedMs.title}`} size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 500, fontSize: '0.75rem' }} />
        </Box>
      </Box>


      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column' }}>
        <DialogContent sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>


          <Box>
            <Typography variant="caption" color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Due Date
            </Typography>
            <TextField
              type="date" fullWidth size="small" sx={{ mt: 0.75 }}
              error={!!errors.due_date}
              helperText={errors.due_date?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('due_date')}
            />
          </Box>

          {/* Line Items */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary"
                sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Invoice Items
              </Typography>
              {errors.items?.root && (
                <Typography variant="caption" color="error">{errors.items.root.message}</Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 0.75, px: 0.5 }}>
              <Typography variant="caption" color="text.disabled" sx={{ flex: 2 }}>Description</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ flex: 1 }}>Amount (NPR)</Typography>
              <Box sx={{ width: 36 }} />
            </Box>

            <Stack sx={{ gap: 1 }}>
              {fields.map((field, index) => (
                <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    placeholder="e.g. UI Design, Extra revision"
                    size="small" sx={{ flex: 2 }}
                    error={!!errors.items?.[index]?.description}
                    helperText={errors.items?.[index]?.description?.message}
                    {...register(`items.${index}.description`)}
                  />
                  <TextField
                    placeholder="0" size="small" type="number" sx={{ flex: 1 }}
                    error={!!errors.items?.[index]?.amount}
                    helperText={errors.items?.[index]?.amount?.message}
                    {...register(`items.${index}.amount`, { valueAsNumber: true })}
                  />
                  <IconButton size="small" onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{ mt: 0.5, color: 'error.main', opacity: fields.length === 1 ? 0.3 : 1 }}>
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Button
              size="small" startIcon={<AddRounded />}
              onClick={() => append({ description: '', amount: 0 })}
              sx={{
                mt: 1.5, color: 'text.secondary', fontSize: '0.8rem',
                border: '1px dashed #D1D5DB', borderRadius: 1.5,
                px: 2, py: 0.75, width: '100%',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              Add line item
            </Button>
          </Box>


          <Box>
            <Typography variant="caption" color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Notes (optional)
            </Typography>
            <TextField
              multiline rows={2} fullWidth size="small" sx={{ mt: 0.75 }}
              placeholder="Payment instructions, thank you note, etc."
              {...register('notes')}
            />
          </Box>

          {/* Subtotal / Tax / Total breakdown */}
          <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.25 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2">NPR {subtotal.toLocaleString()}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.25 }}>
              <Typography variant="body2" color="text.secondary">VAT (13%)</Typography>
              <Typography variant="body2">NPR {tax.toLocaleString()}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.25, bgcolor: '#F8FAF9' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Total</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }} color="primary.main">
                NPR {total.toLocaleString()}
              </Typography>
            </Box>
          </Box>

        </DialogContent>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
          <Button variant="outlined" onClick={handleClose}
            sx={{ color: 'text.secondary', borderColor: '#E0E0E0', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}
            sx={{ fontWeight: 600, minWidth: 130 }}>
            {isPending
              ? <CircularProgress size={18} sx={{ color: '#fff' }} />
              : 'Save as Draft'
            }
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default InvoiceModalForm