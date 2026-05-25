import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material'

import { useGetSingleInvoice } from '../hooks/useGetSingleInvoice'
import type { InvoiceStatus } from '../types/types'
import { useAuthStore } from '../../auth/stores/authStore'
import { generateInvoicePDF } from '../utils/generateInvoicePDF'

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case 'draft':
      return 'default'
    case 'sent':
      return 'info'
    case 'paid':
      return 'success'
    case 'overdue':
      return 'error'
    default:
      return 'default'
  }
}

export const InvoiceDetail = () => {
  const { data: invoice } = useGetSingleInvoice()
  const user = useAuthStore(state => state.user)
  console.log(invoice)

  if (!invoice) return <Typography>Loading...</Typography>

  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Stack sx={{
        direction: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}
      >
        <Box>
          <Typography variant="h4">
            {invoice.invoice_number}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Created: {new Date(invoice.created_at).toDateString()}
          </Typography>
        </Box>

        <Chip
          label={invoice.status}
          color={getStatusColor(invoice.status)}
        />

        <Button onClick={()=> generateInvoicePDF(invoice)}>Download invoice</Button>
      </Stack>

      {/* META INFO */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={1}>
          <Typography>
            <b>Due Date:</b> {invoice.due_date}
          </Typography>

          <Typography>
            <b>Total:</b> Rs. {invoice.total}
          </Typography>

          <Typography>
            <b>Client ID:</b> {invoice.client_id}
          </Typography>

          <Typography>
            <b>Client Name:</b> {invoice.clients?.name}
          </Typography>

          <Typography sx={{
            textTransform:
              'capitalize'
          }} >
            <b>Sent by</b>: {user?.name}
          </Typography>

          <Typography>
            <b>Project ID:</b> {invoice.project_id}
          </Typography>
        </Stack>
      </Paper>

      {/* ITEMS */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{mb:2}}>
          Invoice Items
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoice.invoice_items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">
                    Rs. {item.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        <Stack sx={{direction:"row", justifyContent:"flex-end"}}>
          <Typography variant="h6">
            Total: Rs. {invoice.total}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}