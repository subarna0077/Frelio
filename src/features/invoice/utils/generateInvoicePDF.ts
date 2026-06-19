import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Invoice } from '../types/types'

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF()

  const {
    invoice_number,
    created_at,
    due_date,
    total,
    subtotal,
    tax,
    amount_paid,
    amount_due,
    status,
    notes,
    clients,
    projects,
    invoice_items,
    sender_snapshot,
  } = invoice

  const rs = (n: number | null | undefined) =>
    `Rs. ${Number(n ?? 0).toLocaleString()}`

  const fmt = (d: string | null) =>
    d ? new Date(d).toDateString() : '—'

  // ── STATUS COLOR ─────────────────────────────────────
  const statusColor: [number, number, number] =
    status === 'paid' ? [22, 163, 74]
    : status === 'overdue' ? [220, 38, 38]
    : status === 'sent' ? [37, 99, 235]
    : [100, 100, 100]

  // ── HEADER ───────────────────────────────────────────
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text('INVOICE', 20, 26)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120)
  doc.text(`#${invoice_number}`, 20, 34)

  // Status badge
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...statusColor)
  doc.text(status.toUpperCase(), 190, 26, { align: 'right' })
  doc.setTextColor(0)

  // ── FROM (sender) ────────────────────────────────────
  if (sender_snapshot) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(130)
    doc.text('FROM', 130, 26)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30)
    doc.text(sender_snapshot.name ?? '', 130, 33)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80)
    if (sender_snapshot.email) doc.text(sender_snapshot.email, 130, 39)
  }

  // ── DIVIDER ──────────────────────────────────────────
  doc.setDrawColor(220)
  doc.line(20, 52, 190, 52)

  // ── BILLED TO + DATES ────────────────────────────────
  doc.setFontSize(8)
  doc.setTextColor(130)
  doc.setFont('helvetica', 'bold')
  doc.text('BILLED TO', 20, 62)
  doc.text('INVOICE DATE', 120, 62)
  doc.text('DUE DATE', 165, 62)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(20)
  doc.text(clients?.name ?? '—', 20, 70)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80)
  if (clients?.phone) doc.text(clients.phone, 20, 77)
  if (clients?.email) doc.text(clients.email, 20, 83)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(30)
  doc.text(fmt(created_at), 120, 70)
  doc.text(fmt(due_date), 165, 70)

  // ── PROJECT ──────────────────────────────────────────
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(130)
  doc.text('PROJECT', 20, 96)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(30)
  doc.text(projects?.title ?? '—', 20, 103)

  // ── ITEMS TABLE ──────────────────────────────────────
  autoTable(doc, {
    startY: 113,
    head: [['Description', 'Amount (Rs.)']],
    body: invoice_items?.map((item: any) => [
      item.description,
      Number(item.amount).toLocaleString(),
    ]) ?? [],
    headStyles: {
      fillColor: [30, 30, 30],
      fontSize: 10,
      fontStyle: 'bold',
      textColor: 255,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      1: { halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  })

  const tableBottom = (doc as any).lastAutoTable.finalY

  // ── TOTALS BLOCK ─────────────────────────────────────
  let y = tableBottom + 10

  doc.setDrawColor(230)
  doc.line(120, y, 190, y)
  y += 8

  const row = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(bold ? 11 : 10)
    doc.setTextColor(bold ? 20 : 80)
    doc.text(label, 125, y)
    doc.text(value, 190, y, { align: 'right' })
    y += 8
  }

  row('Subtotal', rs(subtotal))
  if (tax && tax > 0) row('Tax (13% VAT)', rs(tax))
  if (amount_paid && amount_paid > 0) row('Amount Paid', rs(amount_paid))

  doc.setDrawColor(200)
  doc.line(120, y, 190, y)
  y += 8
  row('Total Due', rs(amount_due ?? total), true)

  // ── NOTES ────────────────────────────────────────────
  if (notes) {
    y = tableBottom + 10
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(130)
    doc.text('NOTES', 20, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(60)
    const lines = doc.splitTextToSize(notes, 85)
    doc.text(lines, 20, y)
  }

  // ── FOOTER ───────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(180)
  doc.line(20, 282, 190, 282)
  doc.text('Thank you for your business.', 105, 288, { align: 'center' })

  doc.save(`${invoice_number}.pdf`)
}