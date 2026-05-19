import React, { useState } from 'react';
import {
    Box, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Divider, Stack, TextField, List, ListItem,
    ListItemText, IconButton, Button, Chip, Checkbox, Tooltip,
    CircularProgress, Paper,
} from '@mui/material';
import {
    CloseRounded, AddRounded, DeleteOutlineRounded,
    ReceiptRounded, FlagRounded, CheckCircleRounded,
    RadioButtonUncheckedRounded, InfoOutlined,
} from '@mui/icons-material';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInvoiceStore } from '../stores/InvoiceStore';
import { useParams } from 'react-router-dom';
import { useCreateInvoice } from '../hooks/useCreateInvoice';
import type { Project } from '../../projects/types/types';
import type { Milestone } from '../../milestone/types/types';
import {toast} from 'react-hot-toast'
import type { Invoice } from '../types/types';

// ── Schemas ────────────────────────────────────────────────────────────────
export const InvoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z
        .number({ invalid_type_error: 'Enter a valid amount' })
        .min(1, 'Must be greater than 0'),
});

export const InvoiceSchema = z.object({
    due_date: z.string().optional(),
    items: z.array(InvoiceItemSchema).min(1, 'Add at least one line item'),
});

export type InvoiceFormType = z.infer<typeof InvoiceSchema>;

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
    client_id: string;
    project_data: Project;
    milestone_data: Milestone[];
}

export const InvoiceModalForm = ({ client_id, project_data, milestone_data }: Props) => {
    const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
    const setOpenModal = useInvoiceStore(state => state.setOpenModal);
    const openModal = useInvoiceStore(state=> state.openModal)
    const { id: project_id } = useParams();
    const { mutate: createInvoice, isPending } = useCreateInvoice(client_id, project_id);

    const {
        register, control, handleSubmit, watch,
        formState: { errors },
    } = useForm<InvoiceFormType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            due_date: '',
            items: [{ description: '', amount: 0 }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({ control, name: 'items' });

    // live total from watched items
    const watchedItems = watch('items');
    const total = watchedItems?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) ?? 0;

    const toggleMilestone = (id: string) => {
        setSelectedMilestones(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const fillFromMilestones = () => {
        const items = milestone_data
            .filter(m => selectedMilestones.includes(m.id))
            .map(m => ({ description: m.name, amount: m.amount }));
        if (items.length > 0) replace(items);
    };

    const onSubmit = (data: InvoiceFormType) => {
        createInvoice(data, {
            onSuccess: (invoice: Invoice)=>{
                console.log(invoice)
                toast.success(`Invoice ${invoice.invoice_number} draft created successfully`)
                setOpenModal(false);
            },
            onError: ()=>{
                toast.error('Error creating invoice.')
            }

        });
    };

    const completedMilestones = milestone_data.filter(m => m.is_completed);

    return (
        <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            maxWidth="sm"
            fullWidth
            slotProps={
                {
                    paper: {
                        sx: {
                            borderRadius: 3,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                            overflow: 'scroll',

                        }
                    }
                }
            }
           
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <Box sx={{
                px: 3, pt: 3, pb: 2,
                background: 'linear-gradient(135deg, #1D9E75 0%, #157A5A 100%)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 40, height: 40, borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <ReceiptRounded sx={{ color: '#fff', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#fff" lineHeight={1.2}>
                                Create Invoice
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                Draft will be saved — send later
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={() => setOpenModal(false)}
                        sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        <CloseRounded fontSize="small" />
                    </IconButton>
                </Box>

                {/* Project + Client pills */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Chip
                        label={`📁 ${project_data?.title}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 500, fontSize: '0.75rem' }}
                    />
                    <Chip
                        label={`👤 ${project_data?.clients?.name}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 500, fontSize: '0.75rem' }}
                    />
                </Box>
            </Box>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <DialogContent sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Due Date */}
                    <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Due Date
                        </Typography>
                        <TextField
                            type="date"
                            fullWidth
                            size="small"
                            sx={{ mt: 0.75 }}
                            error={!!errors.due_date}
                            helperText={errors.due_date?.message}
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        
                            {...register('due_date')}
                        />
                    </Box>

                    {/* Milestones */}
                    {completedMilestones.length > 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <FlagRounded sx={{ fontSize: 16, color: 'primary.main' }} />
                                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Completed Milestones
                                    </Typography>
                                </Box>
                                <Tooltip title="Select milestones then click Fill to add them as line items">
                                    <InfoOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />
                                </Tooltip>
                            </Box>

                            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', borderColor: '#E5E7EB' }}>
                                <List disablePadding>
                                    {completedMilestones.map((milestone, idx) => {
                                        const isSelected = selectedMilestones.includes(milestone.id);
                                        return (
                                            <React.Fragment key={milestone.id}>
                                                <ListItem
                                                    sx={{
                                                        px: 2, py: 1,
                                                        cursor: 'pointer',
                                                        bgcolor: isSelected ? 'rgba(29,158,117,0.06)' : 'transparent',
                                                        transition: 'background 0.15s ease',
                                                        '&:hover': { bgcolor: isSelected ? 'rgba(29,158,117,0.1)' : 'rgba(0,0,0,0.02)' },
                                                    }}
                                                    onClick={() => toggleMilestone(milestone.id)}
                                                >
                                                    <Checkbox
                                                        checked={isSelected}
                                                        size="small"
                                                        icon={<RadioButtonUncheckedRounded />}
                                                        checkedIcon={<CheckCircleRounded />}
                                                        sx={{
                                                            p: 0, mr: 1.5,
                                                            color: 'text.disabled',
                                                            '&.Mui-checked': { color: 'primary.main' },
                                                        }}
                                                    />
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" fontWeight={500}>{milestone.name}</Typography>
                                                        }
                                                    />
                                                    <Typography variant="body2" fontWeight={600} color={isSelected ? 'primary.main' : 'text.secondary'}>
                                                        NPR {milestone.amount?.toLocaleString()}
                                                    </Typography>
                                                </ListItem>
                                                {idx < completedMilestones.length - 1 && <Divider />}
                                            </React.Fragment>
                                        );
                                    })}
                                </List>
                            </Paper>

                            {selectedMilestones.length > 0 && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={fillFromMilestones}
                                    sx={{
                                        mt: 1, borderColor: 'primary.main', color: 'primary.main',
                                        fontSize: '0.75rem', fontWeight: 600,
                                    }}
                                >
                                    Fill {selectedMilestones.length} selected as line items
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* Line Items */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Invoice Items
                            </Typography>
                            {errors.items?.root && (
                                <Typography variant="caption" color="error">{errors.items.root.message}</Typography>
                            )}
                        </Box>

                        {/* Column headers */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 0.75, px: 0.5 }}>
                            <Typography variant="caption" color="text.disabled" sx={{ flex: 2 }}>Description</Typography>
                            <Typography variant="caption" color="text.disabled" sx={{ flex: 1 }}>Amount (NPR)</Typography>
                            <Box sx={{ width: 36 }} />
                        </Box>

                        <Stack gap={1}>
                            {fields.map((field, index) => (
                                <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                    <TextField
                                        placeholder="e.g. UI Design, Extra revision"
                                        size="small"
                                        sx={{ flex: 2 }}
                                        error={!!errors.items?.[index]?.description}
                                        helperText={errors.items?.[index]?.description?.message}
                                        {...register(`items.${index}.description`)}
                                    />
                                    <TextField
                                        placeholder="0"
                                        size="small"
                                        type="number"
                                        sx={{ flex: 1 }}
                                        error={!!errors.items?.[index]?.amount}
                                        helperText={errors.items?.[index]?.amount?.message}
                                        {...register(`items.${index}.amount`, { valueAsNumber: true })}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        sx={{ mt: 0.5, color: 'error.main', opacity: fields.length === 1 ? 0.3 : 1 }}
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
                            sx={{
                                mt: 1.5, color: 'text.secondary', fontSize: '0.8rem',
                                border: '1px dashed #D1D5DB', borderRadius: 1.5,
                                px: 2, py: 0.75, width: '100%',
                                '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'rgba(29,158,117,0.04)' },
                            }}
                        >
                            Add line item
                        </Button>
                    </Box>

                    {/* Total */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        bgcolor: '#F8FAF9', border: '1px solid #E5E7EB',
                        borderRadius: 2, px: 2.5, py: 1.5,
                    }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>Total</Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            NPR {total.toLocaleString()}
                        </Typography>
                    </Box>

                </DialogContent>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenModal(false)}
                        sx={{ color: 'text.secondary', borderColor: '#E0E0E0', fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        sx={{ fontWeight: 600, minWidth: 130 }}
                    >
                        {isPending
                            ? <CircularProgress size={18} sx={{ color: '#fff' }} />
                            : 'Save as Draft'
                        }
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default InvoiceModalForm;