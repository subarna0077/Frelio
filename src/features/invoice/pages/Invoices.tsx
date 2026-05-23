import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    IconButton,
    Skeleton,
    Stack
} from '@mui/material'

import PrintIcon from '@mui/icons-material/Print'

import type { Invoice } from '../types/types'
import type { InvoiceStatus } from '../types/types'
import { useListInvoices } from '../hooks/useListInvoices'
import { useUpdateInvoiceStatus } from '../hooks/useUpdateInvoiceStatus'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const invoiceStatuses: InvoiceStatus[] = [
    'draft',
    'sent',
    'paid',
    'overdue',
]


export const Invoices = () => {

    const { data: invoices, isLoading } = useListInvoices()
    const { mutate: updateInv } = useUpdateInvoiceStatus();

    const navigate = useNavigate()



    const handleStatusChange = (id: string, status: InvoiceStatus) => {
        updateInv({
            id, status
        }, {
            onSuccess: (invoice: Invoice) => {
                toast.success(`Changed the status to ${invoice.status} `)
            }
        })
    }

    if (isLoading) return (
        <Stack direction='column'>
            <Skeleton variant='text' width='full' height='40px'></Skeleton>

            <Skeleton variant='rectangular' width='full' height='100px' sx={{ mb: 2 }}></Skeleton>
            <Skeleton variant='rectangular' width='full' height='100px'></Skeleton>

        </Stack>

    )

    if (invoices?.length === 0) return (
        <p>
            No invoices available. Add invoice from project detail page.
        </p>)

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Invoices
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Print</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {invoices?.map((invoice) => (
                            <TableRow onClick={() => navigate(`/invoices/${invoice.id}`)} key={invoice.id} sx={{
                                "&:hover": {
                                    bgcolor: '#f7f5f0',
                                    cursor: 'pointer'
                                }
                            }}>
                                <TableCell>
                                    {invoice.invoice_number}
                                </TableCell>

                                <TableCell>
                                    {invoice.clients?.name}
                                </TableCell>

                                <TableCell>
                                    {new Date(invoice.created_at).toDateString()}
                                </TableCell>

                                <TableCell>
                                    {invoice.due_date}
                                </TableCell>

                                <TableCell>
                                    {invoice.total}
                                </TableCell>

                                <TableCell>
                                    <Select
                                        size="small"
                                        value={invoice.status}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                            handleStatusChange(invoice.id, e.target.value as InvoiceStatus)

                                        }}
                                    >
                                        {invoiceStatuses.map((status, index) =>
                                            <MenuItem key={index} value={status}>
                                                {status}
                                            </MenuItem>)}
                                    </Select>
                                </TableCell>

                                <TableCell>
                                    <IconButton>
                                        <PrintIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}