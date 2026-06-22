import { useState } from 'react'
import {
    Box, Typography, IconButton, Menu, MenuItem, Skeleton, Chip,
} from '@mui/material'
import {
    ReceiptOutlined,
    MoreVertRounded,
    SendOutlined,
    PersonOutlined,
    CalendarTodayOutlined,
} from '@mui/icons-material'
import type { Invoice, InvoiceStatus } from '../types/types'
import { useListInvoices } from '../hooks/useListInvoices'
import { useDeleteInvoice } from '../hooks/useDeleteInvoice'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSendInvoice } from '../hooks/useSendInvoice'

// ── status color map ──────────────────────────────────────────────────────────

const statusChip: Record<InvoiceStatus, { bgcolor: string; color: string; label: string }> = {
    draft:          { bgcolor: '#F1EFE8', color: '#5F5E5A', label: 'Draft' },
    viewed:         { bgcolor: '#E8F0FE', color: '#1A73E8', label: 'Viewed' },
    sent:           { bgcolor: '#E6F1FB', color: '#185FA5', label: 'Sent' },
    partially_paid: { bgcolor: '#FFF4E5', color: '#B45309', label: 'Partially paid' },
    paid:           { bgcolor: '#E1F5EE', color: '#0F6E56', label: 'Paid' },
    overdue:        { bgcolor: '#FCEBEB', color: '#A32D2D', label: 'Overdue' },
    cancelled:      { bgcolor: '#FDECEC', color: '#B42318', label: 'Cancelled' },
}

// ── page ──────────────────────────────────────────────────────────────────────

export const Invoices = () => {
    const { data: invoices = [], isLoading } = useListInvoices()
    const { mutate: sendInv } = useSendInvoice()
    const { mutate: delInv }  = useDeleteInvoice()
    const navigate = useNavigate()

    const [anchorEl,   setAnchorEl]   = useState<HTMLElement | null>(null)
    const [currentInv, setCurrentInv] = useState<Invoice | null>(null)

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, invoice: Invoice) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
        setCurrentInv(invoice)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setCurrentInv(null)
    }

    const handleSendInv = () => {
        if (!currentInv) return
        sendInv({ invoice_id: currentInv.id, public_token: currentInv.public_token }, {
            onSuccess: () => { toast.success('Invoice sent.');    handleMenuClose() },
            onError:   (error) => toast.error(error.message),
        })
    }

    const handleInvDelete = () => {
        if (!currentInv) return
        delInv(currentInv.id, {
            onSuccess: () => { toast.success('Invoice deleted.'); handleMenuClose() },
            onError:   () => toast.error('Error deleting invoice.'),
        })
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            {/* Page header */}
            <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Invoices</Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>
                    {isLoading ? '—' : `${invoices.length} total invoice${invoices.length !== 1 ? 's' : ''}`}
                </Typography>
            </Box>

            {/* Invoice list */}
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>

                {isLoading ? (
                    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {[1, 2, 3, 4].map(i => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1.5, flexShrink: 0 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton width="30%" height={16} />
                                    <Skeleton width="50%" height={13} sx={{ mt: 0.5 }} />
                                </Box>
                                <Skeleton width={55} height={22} variant="rounded" sx={{ borderRadius: 999 }} />
                            </Box>
                        ))}
                    </Box>

                ) : invoices.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', px: 2.5 }}>
                        <ReceiptOutlined sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>No invoices yet</Typography>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
                            Create an invoice from a project's detail page.
                        </Typography>
                    </Box>

                ) : (
                    invoices.map((invoice, idx) => {
                        const chip = statusChip[invoice.status]
                        return (
                            <Box
                                key={invoice.id}
                                onClick={() => navigate(`/invoices/${invoice.id}`)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 2.5,
                                    py: 1.5,
                                    cursor: 'pointer',
                                    borderBottom: idx < invoices.length - 1 ? '0.5px solid' : 'none',
                                    borderColor: 'divider',
                                    '&:hover': { bgcolor: 'action.hover' },
                                }}
                            >
                                {/* Status-tinted icon box */}
                                <Box sx={{
                                    width: 32, height: 32, borderRadius: 1.5,
                                    bgcolor: chip.bgcolor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <ReceiptOutlined sx={{ fontSize: 15, color: chip.color }} />
                                </Box>

                                {/* Centre: invoice number + meta on line 1,
                                    amount + chip on line 2 (mobile) / right column (sm+) */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>

                                    {/* Line 1: number + meta */}
                                    <Typography sx={{ fontSize: 14, fontWeight: 500 }} noWrap>
                                        {invoice.invoice_number}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <PersonOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                                                {invoice.clients?.name ?? '—'}
                                            </Typography>
                                        </Box>
                                        {invoice.due_date && (
                                            <>
                                                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>·</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarTodayOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                                                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                                                        Due {invoice.due_date}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </Box>

                                    {/* Line 2 (mobile only): amount + chip tucked under the name */}
                                    <Box sx={{
                                        display: { xs: 'flex', sm: 'none' },
                                        alignItems: 'center',
                                        gap: 1,
                                        mt: 0.75,
                                    }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                                            NPR {Number(invoice.total).toLocaleString()}
                                        </Typography>
                                        <Chip
                                            label={chip.label}
                                            size="small"
                                            sx={{
                                                height: 20, fontSize: 11, fontWeight: 500,
                                                bgcolor: chip.bgcolor, color: chip.color,
                                                '& .MuiChip-label': { px: 1 },
                                            }}
                                        />
                                    </Box>
                                </Box>

                                {/* Amount + chip — desktop only, stay on the right */}
                                <Box sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    alignItems: 'center',
                                    gap: 1.5,
                                    flexShrink: 0,
                                }}>
                                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                                        NPR {Number(invoice.total).toLocaleString()}
                                    </Typography>
                                    <Chip
                                        label={chip.label}
                                        size="small"
                                        sx={{
                                            height: 22, fontSize: 11, fontWeight: 500,
                                            bgcolor: chip.bgcolor, color: chip.color,
                                            '& .MuiChip-label': { px: 1.25 },
                                            flexShrink: 0,
                                        }}
                                    />
                                </Box>

                                {/* Actions — always visible */}
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, invoice)}
                                    sx={{ color: 'text.disabled', flexShrink: 0 }}
                                >
                                    <MoreVertRounded sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Box>
                        )
                    })
                )}
            </Box>

            {/* Context menu */}
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        sx: {
                            minWidth: 160,
                            border: '1px solid', borderColor: 'divider',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={handleSendInv}
                    disabled={!currentInv || currentInv.status === 'paid'}
                    sx={{ fontSize: 13, gap: 1 }}
                >
                    <SendOutlined sx={{ fontSize: 15, color: 'text.disabled' }} />
                    Send invoice
                </MenuItem>
                <MenuItem onClick={handleInvDelete} sx={{ fontSize: 13, color: 'error.main', gap: 1 }}>
                    Delete invoice
                </MenuItem>
            </Menu>

        </Box>
    )
}