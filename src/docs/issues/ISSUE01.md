## Issue - 001

### Title: Milestones can be invoiced multiple times

## Problem:
- System allows same milestones to be used in multiple invoices.

Impact:
Duplicate billing risk, redundant revenue tracking.


How can we fix this? 

- Add a status field in invoice:
Status options - pending | completed | invoiced | paid

it goes like this pending -> completed -> invoiced -> paid.