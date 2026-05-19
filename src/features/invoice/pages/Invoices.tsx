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
} from '@mui/material'

import PrintIcon from '@mui/icons-material/Print'

import type { Invoice } from '../types/types'
import type { InvoiceStatus } from '../types/types'
import { useListInvoices } from '../hooks/useListInvoices'
import { useUpdateInvoiceStatus } from '../hooks/useUpdateInvoiceStatus'
import { toast } from 'react-hot-toast'

const invoiceStatuses: InvoiceStatus[] = [
    'draft',
    'sent',
    'paid',
    'overdue',
]


export const Invoices = () => {

    const { data: invoices } = useListInvoices()
    const { mutate: updateInv } = useUpdateInvoiceStatus();



    const handleStatusChange = (id: string, status: InvoiceStatus) => {
        updateInv({
            id, status
        }, {
            onSuccess: (invoice: Invoice) => {
                toast.success(`Changed the status to ${invoice.status} `)
            }
        })
    }

    return (
        <Box sx={{p:4}}>
            <Typography variant="h4" sx={{mb:3}}>
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
                            <TableRow key={invoice.id}>
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
                                        onChange={(e) => handleStatusChange(invoice.id, e.target.value as InvoiceStatus)}
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