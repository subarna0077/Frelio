import { useParams } from "react-router-dom";
import { useGetInvoiceByToken } from "../../features/invoice/hooks/useGetInvoiceByToken";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaidIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";
import { generateInvoicePDF } from "../../features/invoice/utils/generateInvoicePDF";
import { useInitiateKhalti } from "../../features/payments/hooks/useInitiateKhalti";
import type { Invoice, InvoiceStatus } from "../../features/invoice/types/types";
import { toast } from "react-hot-toast";

/* ------------------------------
   STATUS CONFIG
--------------------------------*/
const STATUS_STYLES: Record<InvoiceStatus, { bg: string; color: string }> = {
  paid:            { bg: "#EAF3DE", color: "#27500A" }, // green
  sent:            { bg: "#E6F1FB", color: "#0C447C" }, // blue
  overdue:         { bg: "#FCEBEB", color: "#791F1F" }, // red
  draft:           { bg: "#F1EFE8", color: "#5F5E5A" }, // gray
  cancelled:       { bg: "#FAECE7", color: "#712B13" }, // coral
  partially_paid:  { bg: "#FAEEDA", color: "#633806" }, // amber
  viewed:          { bg: "#EEEDFE", color: "#3C3489" }, // purple
};

const fmt = (d: string | null) => (d ? new Date(d).toDateString() : "—");

/* ------------------------------
   CLIENT PORTAL CONTAINER
--------------------------------*/
export const ClientPortal = () => {
  const { id } = useParams<{ id: string }>();
  const { data: invoice, isLoading } = useGetInvoiceByToken(id ?? "");

  if (!id) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Invalid portal link.</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">Loading invoice...</Typography>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">Invoice not found.</Typography>
      </Box>
    );
  }

  return <ClientInvoicePortal invoice={invoice} />;
};


export default function ClientInvoicePortal({ invoice }: { invoice: Invoice }) {
  const { mutate: initiateKhalti } = useInitiateKhalti();

  const isAlreadyCompleted = invoice.status === "paid";

  const sendPaymentRequest = () => {
    if (isAlreadyCompleted) {
      toast.success("Payment is already completed.");
      return;
    }
    initiateKhalti({
      id: invoice.id,
      purchaseOrderId: invoice.id,
      amount: invoice.total,
      purchaseOrderName: invoice.invoice_number,
    });
  };

  const {
    invoice_number,
    total,
    subtotal,
    tax,
    amount_due,
    status,
    due_date,
    created_at,
    notes,
    clients,
    projects,
    invoice_items,
  } = invoice;

  const badge = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4, px: 2 }}>
      <Box sx={{ maxWidth: 680, mx: "auto" }}>

        {/* ── TOP BAR ── */}
        <Stack
          direction="row"
          sx={{ mb: 3, justifyContent:"space-between", alignItems:"center"}}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "text.secondary",
            }}
          >
            FRELIO
          </Typography>

          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              bgcolor: badge.bg,
              color: badge.color,
            }}
          >
            {status.toUpperCase()}
          </Box>
        </Stack>

        {/* ── HEADER CARD ── */}
        <Paper
          elevation={0}
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 3,
            mb: 1.5,
          }}
        >
          <Stack direction="row" sx={{justifyContent:"space-between" ,alignItems:"flex-start"}}>
            <Box>
              <Typography variant="h5" sx={{fontWeight:500}}>
                Invoice #{invoice_number}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Issued {fmt(created_at)}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "text.disabled",
                  mb: 0.5,
                }}
              >
                DUE DATE
              </Typography>
              <Typography sx={{fontWeight:500, fontSize:14}}>
                {fmt(due_date)}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            {/* Billed to */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "text.disabled",
                  mb: 0.75,
                }}
              >
                BILLED TO
              </Typography>
              <Typography sx={{fontWeight: 500}}>{clients?.name ?? "—"}</Typography>
              {clients?.email && (
                <Typography variant="body2" color="text.secondary">
                  {clients.email}
                </Typography>
              )}
              {clients?.phone && (
                <Typography variant="body2" color="text.secondary">
                  {clients.phone}
                </Typography>
              )}
            </Box>

            {/* Project */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "text.disabled",
                  mb: 0.75,
                }}
              >
                PROJECT
              </Typography>
              <Typography sx={{fontWeight: 500}}>{projects?.title ?? "—"}</Typography>
              {projects?.status && (
                <Stack direction="row" spacing={0.75} sx={{ mt: 0.5, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {projects.status}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* ── ITEMS CARD ── */}
        <Paper
          elevation={0}
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 3,
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "text.disabled",
              mb: 2,
            }}
          >
            ITEMS
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    pl: 0,
                    fontSize: 11,
                    color: "text.disabled",
                    letterSpacing: "0.06em",
                    borderColor: "divider",
                  }}
                >
                  DESCRIPTION
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    pr: 0,
                    fontSize: 11,
                    color: "text.disabled",
                    letterSpacing: "0.06em",
                    borderColor: "divider",
                  }}
                >
                  AMOUNT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice_items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell
                    sx={{ pl: 0, fontSize: 14, borderColor: "divider" }}
                  >
                    {item.description}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ pr: 0, fontSize: 14, color: "text.secondary", borderColor: "divider" }}
                  >
                    Rs. {Number(item.amount).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <Box sx={{ mt: 2 }}>
            <Stack direction="row"  sx={{ py: 0.5, justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" color="text.secondary">
                Rs. {Number(subtotal ?? 0).toLocaleString()}
              </Typography>
            </Stack>

            {(tax ?? 0) > 0 && (
              <Stack direction="row" sx={{ py: 0.5, justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Tax (13% VAT)</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rs. {Number(tax).toLocaleString()}
                </Typography>
              </Stack>
            )}

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography sx={{fontWeight:500}}>Total due</Typography>
              <Typography sx={{fontWeight:500}}>
                Rs. {Number(amount_due ?? total).toLocaleString()}
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* ── NOTES CARD ── */}
        {notes && (
          <Paper
            elevation={0}
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 3,
              p: 3,
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "text.disabled",
                mb: 1,
              }}
            >
              NOTES
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {notes}
            </Typography>
          </Paper>
        )}

        {isAlreadyCompleted && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#EAF3DE",
              border: "0.5px solid #C0DD97",
              borderRadius: 2,
              px: 2,
              py: 1.25,
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18, color: "#27500A" }} />
            <Typography sx={{ fontSize: 14, color: "#27500A" }}>
              This invoice has been paid. Thank you!
            </Typography>
          </Box>
        )}

        {/* ── ACTIONS ── */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => generateInvoicePDF(invoice)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "text.secondary", bgcolor: "grey.50" },
            }}
          >
            Download PDF
          </Button>

          {!isAlreadyCompleted && (
            <Button
              variant="contained"
              startIcon={<PaidIcon />}
              onClick={sendPaymentRequest}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                bgcolor: "#185FA5",
                boxShadow: "none",
                "&:hover": { bgcolor: "#0C447C", boxShadow: "none" },
              }}
            >
              Pay with Khalti
            </Button>
          )}
        </Stack>

      </Box>
    </Box>
  );
}