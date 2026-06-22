import { useEffect } from 'react'
import {
  Box, Dialog, DialogContent, DialogActions,
  Typography, Stack, TextField,
  IconButton, Button, Divider,
  CircularProgress, InputAdornment,
} from '@mui/material'
import {
  CloseRounded, AddRounded, DeleteOutlineRounded,
  FolderOpenOutlined, PersonOutlineOutlined, FlagOutlined,
} from '@mui/icons-material'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInvoiceStore } from '../stores/InvoiceStore'
import { useParams } from 'react-router-dom'
import { useCreateInvoice } from '../hooks/useCreateInvoice'
import type { Project } from '../../projects/types/types'
import type { Milestone } from '../../milestone/types/types'
import { toast } from 'react-hot-toast'
import { useUpdateMilestoneStatus } from '../../milestone/hooks/useUpdateMilestoneStatus'
import type { Invoice } from '../types/types'

const TAX_RATE = 0.13

// ── Schemas ─────────────────────────────────────────────────────────────────

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount:      z.number({ message: 'Enter a valid amount' }).min(1, 'Must be greater than 0'),
})

export const InvoiceSchema = z.object({
  milestone_id: z.string().uuid(),
  due_date:     z.string().optional(),
  notes:        z.string().optional(),
  items:        z.array(InvoiceItemSchema).min(1, 'Add at least one line item'),
})

export type InvoiceFormType = z.infer<typeof InvoiceSchema>

// ── Props ───────────────────────────────────────────────────────────────────

interface Props {
  client_id:        string
  project_data:     Project
  preSelectedMs:    Milestone
  onInvoiceSuccess?: (data: Invoice) => void
}

// ── Shared field style ───────────────────────────────────────────────────────

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

// ── Component ────────────────────────────────────────────────────────────────

export const InvoiceModalForm = ({ client_id, project_data, preSelectedMs, onInvoiceSuccess }: Props) => {
  const setOpenModal    = useInvoiceStore(state => state.setOpenModal)
  const openModal       = useInvoiceStore(state => state.openModal)
  const { id: project_id } = useParams()
  const { mutate: createInvoice, isPending } = useCreateInvoice(client_id, project_id)
  const { mutate: updateMs } = useUpdateMilestoneStatus()

  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<InvoiceFormType>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      milestone_id: preSelectedMs?.id,
      due_date:     '',
      notes:        '',
      items:        [{ description: preSelectedMs?.title, amount: preSelectedMs?.amount }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  useEffect(() => {
    reset({
      milestone_id: preSelectedMs.id,
      due_date:     '',
      notes:        '',
      items:        [{ description: preSelectedMs.title, amount: preSelectedMs.amount }],
    })
  }, [preSelectedMs.id])

  const watchedItems = watch('items')
  const subtotal = watchedItems?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) ?? 0
  const tax      = Math.round(subtotal * TAX_RATE)
  const total    = subtotal + tax

  const handleClose = () => { setOpenModal(false); reset() }

  const onSubmit = (data: InvoiceFormType) => {
    createInvoice({ ...data, subtotal, tax, total }, {
      onSuccess: (data) => {
        if (onInvoiceSuccess) {
          onInvoiceSuccess(data)
        } else {
          updateMs({ milestoneId: preSelectedMs.id, status: 'invoiced', invoiceId: data.id })
          handleClose()
        }
      },
      onError: () => toast.error('Error creating invoice.'),
    })
  }

  return (
    <Dialog
      open={openModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: 2.5 },
            m: { xs: 0, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            maxHeight: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Box sx={{
        px: { xs: 2, sm: 3 }, pt: 2.5, pb: 2,
        borderBottom: '0.5px solid', borderColor: 'divider',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>
            Create invoice
          </Typography>
          <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: 0.25 }}>
            Saved as draft — you can send it later
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'text.disabled', mt: 0.25 }}>
          <CloseRounded sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* ── Context strip ──────────────────────────────────────────────── */}
      <Box sx={{
        px: { xs: 2, sm: 3 }, py: 1.25,
        bgcolor: 'action.hover',
        borderBottom: '0.5px solid', borderColor: 'divider',
        display: 'flex', gap: 2, flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        {[
          { icon: <FolderOpenOutlined sx={{ fontSize: 13 }} />,      label: project_data?.title },
          { icon: <PersonOutlineOutlined sx={{ fontSize: 13 }} />,   label: project_data?.clients?.name },
          { icon: <FlagOutlined sx={{ fontSize: 13 }} />,            label: preSelectedMs.title },
        ].map(({ icon, label }) => label && (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ color: 'text.disabled' }}>{icon}</Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* ── Scrollable form body ────────────────────────────────────────── */}
      <Box
        component="form"
        id="invoice-form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}
      >
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Due date */}
          <Box>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.75 }}>
              Due date
            </Typography>
            <TextField
              type="date" fullWidth size="small"
              error={!!errors.due_date}
              helperText={errors.due_date?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('due_date')}
              sx={fieldSx}
            />
          </Box>

          {/* Line items */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Invoice items
              </Typography>
              {errors.items?.root && (
                <Typography sx={{ fontSize: 11, color: 'error.main' }}>{errors.items.root.message}</Typography>
              )}
            </Box>

            {/* Column headers — desktop only */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, mb: 0.75, px: 0.25 }}>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', flex: 2 }}>Description</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', flex: 1 }}>Amount (NPR)</Typography>
              <Box sx={{ width: 32 }} />
            </Box>

            <Stack sx={{ gap: 1 }}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                  }}
                >
                  <TextField
                    placeholder="e.g. UI Design, Extra revision"
                    size="small"
                    sx={{ flex: 2, ...fieldSx }}
                    error={!!errors.items?.[index]?.description}
                    helperText={errors.items?.[index]?.description?.message}
                    {...register(`items.${index}.description`)}
                  />
                  <TextField
                    placeholder="0"
                    size="small"
                    type="number"
                    sx={{ flex: 1, width: { xs: '100%', sm: 'auto' }, ...fieldSx }}
                    error={!!errors.items?.[index]?.amount}
                    helperText={errors.items?.[index]?.amount?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>NPR</Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...register(`items.${index}.amount`, { valueAsNumber: true })}
                  />
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{
                      alignSelf: { xs: 'flex-end', sm: 'center' },
                      color: 'error.main',
                      opacity: fields.length === 1 ? 0.3 : 1,
                    }}
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Button
              size="small"
              startIcon={<AddRounded />}
              onClick={() => append({ description: '', amount: 0 })}
              sx={{ mt: 1.5, color: 'text.secondary', fontSize: 12, px: 0.5, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
            >
              Add line item
            </Button>
          </Box>

          {/* Notes */}
          <Box>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.75 }}>
              Notes (optional)
            </Typography>
            <TextField
              multiline rows={2} fullWidth size="small"
              placeholder="Payment instructions, thank you note, etc."
              sx={fieldSx}
              {...register('notes')}
            />
          </Box>

          {/* Totals summary */}
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            {[
              { label: 'Subtotal', value: `NPR ${subtotal.toLocaleString()}`, bold: false },
              { label: 'VAT (13%)', value: `NPR ${tax.toLocaleString()}`, bold: false },
            ].map(({ label, value }) => (
              <Box key={label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.25 }}>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{label}</Typography>
                  <Typography sx={{ fontSize: 13 }}>{value}</Typography>
                </Box>
                <Divider />
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.25, bgcolor: 'action.hover' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Total</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>
                NPR {total.toLocaleString()}
              </Typography>
            </Box>
          </Box>

        </DialogContent>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <DialogActions sx={{
          px: { xs: 2, sm: 3 }, pb: { xs: 2.5, sm: 3 }, pt: 2,
          gap: 1,
          borderTop: '0.5px solid', borderColor: 'divider',
          flexShrink: 0,
        }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClose}
            sx={{ fontSize: 13, color: 'text.secondary', borderColor: 'divider' }}
          >
            Cancel
          </Button>
          <Button
            form="invoice-form"
            type="submit"
            variant="contained"
            size="small"
            disabled={isPending}
            sx={{ fontSize: 13, minWidth: 130 }}
          >
            {isPending
              ? <CircularProgress size={16} sx={{ color: '#fff' }} />
              : 'Save as draft'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default InvoiceModalForm