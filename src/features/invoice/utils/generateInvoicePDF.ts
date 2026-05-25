import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateInvoicePDF(invoice: any) {
  const doc = new jsPDF()

  const {
    invoice_number,
    created_at,
    due_date,
    total,
    status,
    clients,
    projects,
    invoice_items,
  } = invoice

  // ── HEADER ──────────────────────────────────────────
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 20, 24)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`#${invoice_number}`, 20, 32)

  // Status badge (top right)
  doc.setFontSize(10)
  doc.setTextColor(status === 'paid' ? 34 : status === 'overdue' ? 200 : 60, 120, 80)
  doc.text(status.toUpperCase(), 190, 24, { align: 'right' })

  doc.setTextColor(0)

  // ── DIVIDER ─────────────────────────────────────────
  doc.setDrawColor(220)
  doc.line(20, 38, 190, 38)

  // ── CLIENT + DATES (two columns) ────────────────────
  doc.setFontSize(9)
  doc.setTextColor(130)
  doc.text('BILLED TO', 20, 50)
  doc.text('INVOICE DATE', 120, 50)
  doc.text('DUE DATE', 160, 50)

  doc.setFontSize(11)
  doc.setTextColor(0)
  doc.setFont('helvetica', 'bold')
  doc.text(clients?.name ?? '—', 20, 58)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(clients?.phone ?? '', 20, 65)
  doc.text(clients?.address ?? '', 20, 72)

  doc.setFontSize(11)
  doc.text(new Date(created_at).toDateString(), 120, 58)
  doc.text(new Date(due_date).toDateString(), 160, 58)

  // ── PROJECT ──────────────────────────────────────────
  doc.setFontSize(9)
  doc.setTextColor(130)
  doc.text('PROJECT', 20, 85)
  doc.setFontSize(11)
  doc.setTextColor(0)
  doc.text(projects?.title ?? '—', 20, 93)

  // ── ITEMS TABLE ──────────────────────────────────────
  autoTable(doc, {
    startY: 105,
    head: [['Description', 'Amount (Rs.)']],
    body: invoice_items?.map((item: any) => [
      item.description,
      Number(item.amount).toLocaleString(),
    ]) ?? [],
    headStyles: {
      fillColor: [40, 40, 40],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      1: { halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  })

  // ── TOTAL ────────────────────────────────────────────
  // autoTable gives us where the table ended
  const tableBottom = (doc as any).lastAutoTable.finalY

  doc.setDrawColor(220)
  doc.line(20, tableBottom + 4, 190, tableBottom + 4)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Total', 140, tableBottom + 14)
  doc.text(`Rs. ${Number(total).toLocaleString()}`, 190, tableBottom + 14, { align: 'right' })

  // ── FOOTER ───────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text('Thank you for your business.', 105, 285, { align: 'center' })

  // ── DOWNLOAD ─────────────────────────────────────────
  doc.save(`${invoice_number}.pdf`)
}