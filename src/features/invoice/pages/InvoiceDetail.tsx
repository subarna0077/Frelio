import { Box, Typography, Chip, Button, Skeleton } from '@mui/material'
import {
    CalendarTodayOutlined,
    PersonOutlined,
    FolderOpenOutlined,
    DownloadOutlined,
    ReceiptOutlined,
} from '@mui/icons-material'
import { useGetSingleInvoice } from '../hooks/useGetSingleInvoice'
import type { InvoiceStatus } from '../types/types'
import { useAuthStore } from '../../auth/stores/authStore'
import { generateInvoicePDF } from '../utils/generateInvoicePDF'

// ── status color map ──────────────────────────────────────────────────────────

const statusChip: Record<
    InvoiceStatus,
    { bgcolor: string; color: string; label: string }
> = {
    draft: {
        bgcolor: '#F1EFE8',
        color: '#5F5E5A',
        label: 'Draft',
    },
    viewed: {
        bgcolor: '#E8F0FE',
        color: '#1A73E8',
        label: 'Viewed',
    },
    sent: {
        bgcolor: '#E6F1FB',
        color: '#185FA5',
        label: 'Sent',
    },
    partially_paid: {
        bgcolor: '#FFF4E5',
        color: '#B45309',
        label: 'Partially Paid',
    },
    paid: {
        bgcolor: '#E1F5EE',
        color: '#0F6E56',
        label: 'Paid',
    },
    overdue: {
        bgcolor: '#FCEBEB',
        color: '#A32D2D',
        label: 'Overdue',
    },
    cancelled: {
        bgcolor: '#FDECEC',
        color: '#B42318',
        label: 'Cancelled',
    },
}
// ── page ──────────────────────────────────────────────────────────────────────

export const InvoiceDetail = () => {
    const { data: invoice } = useGetSingleInvoice()
    const user = useAuthStore(state => state.user)

    if (!invoice) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Skeleton width="40%" height={24} />
            <Skeleton width="25%" height={14} />
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2, mt: 0.5 }} />
            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
        </Box>
    )

    const chip = statusChip[invoice.status]

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            {/* Page header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                            {invoice.invoice_number}
                        </Typography>
                        <Chip
                            label={chip.label}
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: 11,
                                fontWeight: 500,
                                bgcolor: chip.bgcolor,
                                color: chip.color,
                                '& .MuiChip-label': { px: 1.25 },
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                        <CalendarTodayOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                            Created {new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<DownloadOutlined sx={{ fontSize: 15 }} />}
                    onClick={() => generateInvoicePDF(invoice)}
                    sx={{ fontSize: 13, borderColor: 'divider', color: 'text.secondary', flexShrink: 0 }}
                >
                    Download PDF
                </Button>
            </Box>

            {/* Meta card */}
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2.5,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1.5,
                }}
            >
                <MetaRow icon={<PersonOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />} label="Client" value={invoice.clients?.name ?? '—'} />
                <MetaRow icon={<CalendarTodayOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />} label="Due date" value={invoice.due_date} />
                <MetaRow icon={<FolderOpenOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />} label="Project" value={invoice.projects?.title ?? ''} />
                <MetaRow icon={<PersonOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />} label="Sent by" value={user?.name ?? '—'} />
            </Box>

            {/* Amount summary */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                }}
            >
                <Box sx={{ bgcolor: 'action.hover', borderRadius: 1.5, p: '12px 14px' }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: 'text.primary' }}>
                        NPR {Number(invoice.total).toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Invoice total
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: invoice.status === 'paid' ? '#E1F5EE' : 'action.hover', borderRadius: 1.5, p: '12px 14px' }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: invoice.status === 'paid' ? '#0F6E56' : 'text.primary' }}>
                        {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Payment status
                    </Typography>
                </Box>
            </Box>

            {/* Line items */}
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                {/* Card header */}
                <Box sx={{ px: 2.5, py: 1.75, borderBottom: '0.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Line items</Typography>
                </Box>

                {/* Column headers */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2.5,
                        py: 1,
                        bgcolor: 'action.hover',
                        borderBottom: '0.5px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography sx={{ flex: 1, fontSize: 11, fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Description
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Amount
                    </Typography>
                </Box>

                {/* Items */}
                {invoice.invoice_items.length === 0 ? (
                    <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: 3 }}>
                        No line items.
                    </Typography>
                ) : (
                    invoice.invoice_items.map((item, idx) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: 2.5,
                                py: 1.5,
                                borderBottom: idx < invoice.invoice_items.length - 1 ? '0.5px solid' : 'none',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography sx={{ flex: 1, fontSize: 13, color: 'text.primary' }}>
                                {item.description}
                            </Typography>
                            <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                                NPR {Number(item.amount).toLocaleString()}
                            </Typography>
                        </Box>
                    ))
                )}

                {/* Total row */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2.5,
                        py: 1.5,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'action.hover',
                    }}
                >
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em'}}>
                        Total
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: 'text.primary' }}>
                        NPR {Number(invoice.total).toLocaleString()}
                    </Typography>
                </Box>
            </Box>

        </Box>
    )
}

// ── meta row helper ───────────────────────────────────────────────────────────

const MetaRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ mt: '2px', flexShrink: 0 }}>{icon}</Box>
        <Box>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.primary', mt: 0.25 }}>
                {value}
            </Typography>
        </Box>
    </Box>
)