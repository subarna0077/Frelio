# Frelio QA Checklist

> **Instructions:** Go through each item manually. Mark `[x]` for pass, `[f]` for fail, add notes after `→` if something breaks.
> **Goal:** All critical items must pass before LinkedIn post.

---

## Progress
- Total: 47 items
- Passed: 0
- Failed: 0
- Skipped: 0

---

## 1. Auth

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Sign up with a new email | |
| `[ ]` | Email confirmation received and works | |
| `[ ]` | Login with correct credentials | |
| `[ ]` | Login with wrong password shows error | |
| `[ ]` | Session persists after page refresh | |
| `[ ]` | Session persists after closing and reopening tab | |
| `[ ]` | Logout clears session and redirects to login | |
| `[ ]` | Protected routes redirect to login when not authenticated | |

---

## 2. Clients

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Create client with office address only | |
| `[ ]` | Create client with different billing address | |
| `[ ]` | Province → district cascade dropdown works | |
| `[ ]` | Client appears in list immediately after creation | |
| `[ ]` | Client list shows name, phone, email correctly | |
| `[ ]` | Edit client updates correctly | |
| `[ ]` | Empty state shows when no clients exist | |

---

## 3. Projects

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Create project linked to a client | |
| `[ ]` | Project code, start date, due date save correctly | |
| `[ ]` | Description saves correctly | |
| `[ ]` | Project appears in list after creation | |
| `[ ]` | Edit project updates title, dates, description | |
| `[ ]` | Active → On hold transition works | |
| `[ ]` | On hold → Resume (active) transition works | |
| `[ ]` | Active → Cancel shows warning dialog | |
| `[ ]` | Cancelled project hides Edit, On Hold, Cancel buttons | |
| `[ ]` | Mark complete disabled when milestones not all paid | |
| `[ ]` | Empty state shows when no projects exist | |

---

## 4. Milestones

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Add milestone to a project | |
| `[ ]` | order_index preserved — new milestone appears at bottom | |
| `[ ]` | Pending → In progress (Start button) works | |
| `[ ]` | In progress → Completed (Mark done) works | |
| `[ ]` | In progress → Cancelled works | |
| `[ ]` | Cancelled milestone appears faded | |
| `[ ]` | Progress bar updates as milestones change status | |
| `[ ]` | Financial totals (invoiced, paid, outstanding) are correct | |
| `[ ]` | Ready to invoice banner appears for completed milestones | |
| `[ ]` | Empty state shows when no milestones exist | |

---

## 5. Invoices

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Create invoice from completed milestone | |
| `[ ]` | Milestone status changes to invoiced after invoice created | |
| `[ ]` | invoice_id saved to milestone row | |
| `[ ]` | Invoice number generated correctly | |
| `[ ]` | Line items, subtotal, tax, total are correct | |
| `[ ]` | Client snapshot saved correctly | |
| `[ ]` | Send invoice email — client receives it | |
| `[ ]` | Invoice status changes to sent after email | |
| `[ ]` | View invoice button on milestone navigates correctly | |
| `[ ]` | Invoice list shows all invoices | |
| `[ ]` | Empty state shows when no invoices exist | |

---

## 6. Client Portal

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Public portal link opens without login | |
| `[ ]` | Portal shows correct client, project, invoice details | |
| `[ ]` | viewed_at timestamp updates when portal is opened | |
| `[ ]` | Pay with Khalti button visible on portal | |

---

## 7. Payment

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Clicking Pay with Khalti redirects to Khalti page | |
| `[ ]` | After payment, redirects to payment success page | |
| `[ ]` | Payment success page shows correct details | |
| `[ ]` | Invoice status updated to paid | |
| `[ ]` | Invoice paid_at, amount_paid updated correctly | |
| `[ ]` | Milestone status updated to paid | |
| `[ ]` | Project progress bar reflects paid milestone | |

---

## 8. Settings

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | Full name, email display correctly | |
| `[ ]` | Business name, PAN number save correctly | |
| `[ ]` | Changes persist after page refresh | |

---

## 9. General UI

| Status | Test | Notes |
|--------|------|-------|
| `[ ]` | All dates show as readable format (16 Jun 2026) not ISO | |
| `[ ]` | No red errors in browser console | |
| `[ ]` | No broken layouts on 1280px screen | |
| `[ ]` | All toast notifications appear for create/edit/delete actions | |
| `[ ]` | All loading states show while data is fetching | |
| `[ ]` | All modals close correctly after submit or cancel | |

---

## Failed Items Log

> Copy failed items here with details so you can fix them one by one.

| # | Section | What broke | Where to fix |
|---|---------|------------|--------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

---

## Sign off

- [ ] All critical items passing
- [ ] Console is clean
- [ ] Full flow recorded on Loom
- [ ] Ready to post on LinkedIn

---

*Last updated: <!-- add date when you run QA -->*