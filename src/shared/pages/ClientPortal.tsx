import { useParams } from "react-router-dom";
import { useGetInvoiceByToken } from "../../features/invoice/hooks/useGetInvoiceByToken";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent
} from "@mui/material";

import PaidIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";
import { generateInvoicePDF } from "../../features/invoice/utils/generateInvoicePDF";
import { useInitiateKhalti } from "../../features/payments/hooks/useInitiateKhalti";
/* ------------------------------
   CLIENT PORTAL CONTAINER
--------------------------------*/
export const ClientPortal = () => {
  const { id } = useParams<{ id: string }>();

  const { data: invoice, isLoading } = useGetInvoiceByToken(id || "");

  if (!id) return <div>Invalid portal link</div>;

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading invoice...</Typography>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Invoice not found</Typography>
      </Box>
    );
  }

  return <ClientInvoicePortal invoice={invoice} />;
};

/* ------------------------------
   PRESENTATIONAL COMPONENT
--------------------------------*/
export default function ClientInvoicePortal({ invoice }) {
    const {mutate:initiateKhalti} = useInitiateKhalti()

  if (!invoice) return null;

  const {
    id,
    invoice_number,
    total,
    status,
    due_date,
    created_at,
    clients,
    projects,
    invoice_items
  } = invoice;

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "sent":
        return "primary";
      case "draft":
        return "default";
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
      {/* HEADER */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center'}}>
          <Box>
            <Typography variant="h4" sx={{fontWeight:"bold"}}>
              Invoice #{invoice_number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created on {new Date(created_at).toDateString()}
            </Typography>
          </Box>

          <Chip label={status.toUpperCase()} color={getStatusColor(status)} />
        </Stack>
      </Paper>

      {/* CLIENT + PROJECT INFO */}
      <Stack direction={{ xs: "column", md: "row" }} sx={{spacing:2,mb:3}}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Client</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography sx={{fontWeight:"bold"}}>{clients?.name}</Typography>
            <Typography>{clients?.phone}</Typography>
            <Typography>{clients?.address}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6">Project</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography sx={{fontWeight:"bold"}}>{projects?.title}</Typography>
            <Typography>Status: {projects?.status}</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* INVOICE ITEMS */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{mb:2}}>
          Invoice Items
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoice_items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>Rs. {item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* TOTAL + ACTIONS */}
      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} sx={{justifyContent:"space-between" ,alignItems:"center"}}>
          <Box>
            <Typography variant="h6">Total Amount</Typography>
            <Typography variant="h4" sx={{fontWeight:"bold"}}>
              Rs. {total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due Date: {new Date(due_date).toDateString()}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={()=> generateInvoicePDF(invoice)}>
              Download
            </Button>

            <Button variant="contained" startIcon={<PaidIcon />} color="success" onClick={()=> initiateKhalti({id,amount: total, purchaseOrderId:id, purchaseOrderName: clients.name})}>
              Pay Now
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}


