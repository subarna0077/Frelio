# Frelio — Freelancer Project Management

A full stack project management web app built for Nepali freelancers. Manage clients, track projects, break work into milestones, and generate invoices — all in one place.

**Live demo:** [frelio.vercel.app](https://frelio.vercel.app)

---

## The problem it solves

Most Nepali freelancers manage their entire business through WhatsApp and Excel. No proper invoice records, no milestone tracking, no client history — just chaos. Frelio replaces that chaos with a structured, simple workflow.

---

## Features

**Auth**
- Register and login with email and password
- Session persists across page refreshes
- Protected routes — unauthenticated users redirected to login

**Clients**
- Add, edit and delete clients
- Each client has name, phone and address

**Projects**
- Create projects linked to a specific client
- Track status — active, on hold, or completed
- Smart warning when marking a project complete with unfinished milestones
- Edit and delete projects

**Milestones**
- Break each project into milestones with name, amount and due date
- Mark milestones as complete with a timestamp
- Progress bar calculated from completed vs total milestones
- Delete milestones

**Invoices**
- Create invoices directly from a project page
- Dynamic line items — add, remove and edit rows
- Select completed milestones as line items
- Auto calculated total from line items
- Track invoice status — draft, sent, paid, overdue
- View single invoice and print directly from browser
- Delete invoices

**Dashboard**
- Overview of active projects and clients
- Real data from Supabase

---

## Tech stack

| Category | Technology |
|---|---|
| Frontend | React 19, TypeScript |
| UI | Material UI (MUI) v9 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Global state | Zustand v5 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Build tool | Vite |
| Deployment | Vercel |

---

## Project structure

```
src/
  features/
    auth/
      components/       login and register forms
      hooks/            useRegister, useLogin
      stores/           authStore (Zustand)
      types/

    clients/
      components/       AddClientModal, client list
      hooks/            useGetClients, useCreateClient, useEditClient, useDeleteClient
      stores/           ClientStore
      types/

    projects/
      components/       AddProjectModal, project list, single project page
      hooks/            useGetProjects, useGetSingleProject, useCreateProject,
                        useEditProject, useDeleteProject
      stores/           ProjectStore
      types/

    milestone/
      components/       MilestoneModalForm, milestone list
      hooks/            useListMilestones, useCreateMilestone,
                        useCompleteMilestone, useDeleteMilestone
      stores/           milestoneStore
      types/

    invoices/
      components/       InvoiceModalForm, invoice list, single invoice page
      hooks/            useGetInvoices, useGetSingleInvoice, useCreateInvoice,
                        useUpdateInvoiceStatus, useDeleteInvoice
      types/

  shared/
    components/         WarningDialog, ConfirmDialog, shared UI
    hooks/              useWarningDialogStore

  lib/
    supabase.ts         Supabase client setup

  pages/
    DashboardPage
    ClientsPage
    ProjectsPage
    SingleProjectPage
    InvoicesPage
    SingleInvoicePage
    LoginPage
    RegisterPage

  App.tsx               routes and layout
  main.tsx
```

---

## Database schema

```
auth.users          Supabase managed auth table
profiles            full_name, username, phone, business_name, pan_number, currency
clients             name, phone, address — linked to user
projects            name, status, deadline — linked to user and client
milestones          name, amount, due_date, is_completed — linked to project
invoices            invoice_number, total, status, due_date — linked to project and client
invoice_items       description, amount — linked to invoice
```

All tables have Row Level Security (RLS) enabled — users can only access their own data.

---

## Running locally

**Prerequisites:** Node.js 18+, a Supabase project

**1. Clone the repo**

```bash
git clone https://github.com/subarna0077/Frelio.git
cd Frelio
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase dashboard under Settings → API.

**4. Set up the database**

Run the SQL in your Supabase SQL editor to create the tables and RLS policies. See the database schema section above for the structure.

**5. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## What I learned building this

This was built as a learning project to master React and modern frontend architecture. Key concepts covered:

- Feature based folder architecture
- TanStack Query for server state (caching, invalidation, optimistic updates)
- Zustand for global client state
- React Hook Form with Zod validation
- `useFieldArray` for dynamic form rows (invoice line items)
- Supabase joins — fetching related data in one query
- Row Level Security for data isolation
- TypeScript generics on custom hooks
- Session persistence with `onAuthStateChange`
- Protected routes with React Router

---

## Roadmap — Phase 2

- PDF invoice download
- Client portal (public shareable link)
- Dashboard analytics (earnings, pending payments, overdue alerts)
- Mobile responsive layout
- Email notifications
- Multi currency support (NPR + USD)
- Bikram Sambat calendar support

---

## Author

Subarna Sapkota — [github.com/subarna0077](https://github.com/subarna0077)