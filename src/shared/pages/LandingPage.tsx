/**
 * Frelio — Landing Page
 *
 * Setup (two steps):
 *
 * 1. Add Google Fonts to index.html <head>:
 *    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
 *
 * 2. Add this route in AppRouter.tsx (replace the root Navigate redirect):
 *    <Route path="/" element={<LandingPage />} />
 *    Then change /login to just redirect authenticated users to /dashboard.
 */

import { Box, Typography, Button, Container } from '@mui/material'
import {
  PersonOutlined,
  FolderOpenOutlined,
  TaskAltOutlined,
  ReceiptOutlined,
  TrendingUpOutlined,
  OpenInNewOutlined,
  CheckCircleOutlined,
  ArrowForwardRounded,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// ── design tokens ─────────────────────────────────────────────────────────────

const C = {
  bg: '#FFFFFF',
  bgSubtle: '#F7F7F5',
  bgDark: '#0D2218',
  primary: '#0F6E56',
  primaryLight: '#E1F5EE',
  text: '#111210',
  textSec: '#64635F',
  border: '#E5E5E2',
}

const DISPLAY = "'DM Serif Display', Georgia, serif"
const SANS = "'DM Sans', system-ui, -apple-system, sans-serif"

// ── atoms ──────────────────────────────────────────────────────────────────────

const Eyebrow = ({ label }: { label: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
    <Box sx={{ width: 18, height: 1.5, bgcolor: C.primary, borderRadius: 1, flexShrink: 0 }} />
    <Typography sx={{
      fontFamily: SANS,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: C.primary,
    }}>
      {label}
    </Typography>
  </Box>
)

// ── hero mockup — the signature element ───────────────────────────────────────
// A live-rendered JSX version of what an invoice looks like inside Frelio.
// Replace this with an actual screenshot when you have one.

const AppMockup = () => (
  <Box sx={{
    border: `1.5px solid ${C.border}`,
    borderRadius: 2.5,
    overflow: 'hidden',
    bgcolor: C.bg,
    boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: 420,
    userSelect: 'none',
  }}>
    {/* Browser chrome */}
    <Box sx={{
      px: 2,
      py: 1.25,
      bgcolor: C.bgSubtle,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
    }}>
      {['#F87171', '#FBBF24', '#34D399'].map((c, i) => (
        <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c, opacity: 0.55 }} />
      ))}
      <Box sx={{
        ml: 1, flex: 1, height: 20,
        bgcolor: C.bg, border: `1px solid ${C.border}`,
        borderRadius: 0.75, display: 'flex', alignItems: 'center', px: 1,
      }}>
        <Typography sx={{ fontFamily: SANS, fontSize: 10, color: C.textSec }}>
          frelio.vercel.app/invoices/INV-2025-004
        </Typography>
      </Box>
    </Box>

    {/* Invoice content */}
    <Box sx={{ p: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: C.text, lineHeight: 1 }}>
            INV-2025-004
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, color: C.textSec, mt: 0.4 }}>
            Himalayan Threads · Website Redesign
          </Typography>
        </Box>
        <Box sx={{ px: 1.25, py: 0.4, bgcolor: C.primaryLight, borderRadius: 1 }}>
          <Typography sx={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.primary }}>Paid</Typography>
        </Box>
      </Box>

      {/* Line items */}
      {[
        { label: 'UI/UX Design & Wireframing', amt: 'NPR 8,000' },
        { label: 'Frontend Development', amt: 'NPR 22,000' },
        { label: 'Backend & CMS Integration', amt: 'NPR 15,000' },
        { label: 'Testing & Launch', amt: 'NPR 8,000' },
      ].map(item => (
        <Box key={item.label} sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          py: 0.8, borderBottom: `1px solid ${C.border}`,
        }}>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, color: C.textSec }}>{item.label}</Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: C.text }}>{item.amt}</Typography>
        </Box>
      ))}

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5 }}>
        <Typography sx={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>Total</Typography>
        <Typography sx={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.primary }}>NPR 53,000</Typography>
      </Box>

      {/* Milestone progress */}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${C.border}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontFamily: SANS, fontSize: 11, color: C.textSec }}>Milestone progress</Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: C.primary }}>4 of 4 paid</Typography>
        </Box>
        <Box sx={{ height: 4, bgcolor: C.border, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: '100%', bgcolor: C.primary, borderRadius: 2 }} />
        </Box>
      </Box>

      {/* Khalti badge */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <CheckCircleOutlined sx={{ fontSize: 14, color: C.primary }} />
        <Typography sx={{ fontFamily: SANS, fontSize: 11, color: C.textSec }}>
          Paid via Khalti · 15 Mar 2025
        </Typography>
      </Box>
    </Box>
  </Box>
)

// ── data ───────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <PersonOutlined sx={{ fontSize: 20 }} />,
    title: 'Clients',
    desc: "Keep every client's contact info, linked projects, and invoice history in one place. No more digging through email threads.",
  },
  {
    icon: <FolderOpenOutlined sx={{ fontSize: 20 }} />,
    title: 'Projects',
    desc: 'Create projects for each piece of work, assign them to clients, set deadlines, and track their status at a glance.',
  },
  {
    icon: <TaskAltOutlined sx={{ fontSize: 20 }} />,
    title: 'Milestones',
    desc: 'Break your project into phases with a price for each. Milestones become your billing structure — no vague estimates.',
  },
  {
    icon: <ReceiptOutlined sx={{ fontSize: 20 }} />,
    title: 'Invoices',
    desc: 'Generate professional invoices from completed milestones in seconds. Download as PDF or send directly by email.',
  },
  {
    icon: <OpenInNewOutlined sx={{ fontSize: 20 }} />,
    title: 'Client Portal',
    desc: 'Every invoice gets a private shareable link. Your client opens it, reviews the work, and pays — no account needed.',
  },
  {
    icon: <TrendingUpOutlined sx={{ fontSize: 20 }} />,
    title: 'Dashboard',
    desc: 'See your revenue chart, active projects, and recent payments without having to think about where to look.',
  },
]

const steps = [
  {
    n: '1',
    title: 'Add your client',
    desc: 'Name, email, phone. One short form. Done in under a minute.',
  },
  {
    n: '2',
    title: 'Create a project',
    desc: 'Link it to the client. Set a title and dates. The project code is auto-generated.',
  },
  {
    n: '3',
    title: 'Set milestones',
    desc: 'Break the work into phases, each with an amount and due date. This is your billing plan.',
  },
  {
    n: '4',
    title: 'Send an invoice',
    desc: "When a milestone is done, generate an invoice and hit send. The client gets an email with a link.",
  },
  {
    n: '5',
    title: 'Get paid',
    desc: 'They open the link, review the invoice, and pay via Khalti. The status updates automatically.',
  },
]

const screenshots = [
  {
    file: 'dashboard',
    title: 'Dashboard',
    desc: 'Revenue, recent activity, and upcoming deadlines — all at a glance.',
  },
  {
    file: 'project_page',
    title: 'Projects',
    desc: 'Every project broken into milestones. Visual progress bar, milestone status, amounts at a glance.',
  },
  {
    file: 'milestone_creation',
    title: 'Create milestone',
    desc: 'Every project broken into milestones. Visual progress bar, milestone status, amounts at a glance',

  },
  {
    file: 'invoice_creation',
    title: 'Generate invoices',
    desc: 'Create Invoice based on milestone directly - no hassle, auto generation line items'

  },
  {
    file: 'invoice_detail',
    title: 'Invoice Detail',
    desc: 'Clean invoice view with one-click PDF download and a send button that emails the client instantly.',
  },
  {
    file: 'public_portal',
    title: 'Client Portal',
    desc: "What your client sees — a clean invoice they can review and pay without needing an account.",
  },
  {
    file: 'khalti_integration',
    title: 'Pay via khalti',
    desc: 'Payment gateway Khalti integrated for nepali clients - easy, fast and reliable'
  }
]

// ── sections ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        bgcolor: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Typography sx={{ fontFamily: DISPLAY, fontSize: 22, color: C.primary, letterSpacing: '-0.01em' }}>
            Frelio
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{
                fontFamily: SANS, fontSize: 13, fontWeight: 500,
                color: C.textSec, textTransform: 'none', px: 2, py: 0.75,
                borderRadius: 1.5,
                '&:hover': { bgcolor: C.bgSubtle },
              }}
            >
              Log in
            </Button>
            <Button
              onClick={() => navigate('/register')}
              sx={{
                fontFamily: SANS, fontSize: 13, fontWeight: 600,
                color: '#fff', bgcolor: C.primary,
                textTransform: 'none', px: 2.5, py: 0.75, borderRadius: 1.5,
                '&:hover': { bgcolor: '#0A5A45' },
              }}
            >
              Get started free
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: C.bg, pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 7, md: 10 },
        }}>
          {/* Text */}
          <Box sx={{ flex: 1 }}>
            <Eyebrow label="For Nepali freelancers" />
            <Typography
              component="h1"
              sx={{
                fontFamily: DISPLAY,
                fontSize: { xs: 36, md: 52, lg: 58 },
                fontWeight: 400,
                color: C.text,
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: '-0.02em',
              }}
            >
              Stop managing your work in WhatsApp and Excel.
            </Typography>
            <Typography sx={{
              fontFamily: SANS,
              fontSize: { xs: 15, md: 16 },
              color: C.textSec,
              lineHeight: 1.75,
              mb: 4,
              maxWidth: 480,
            }}>
              Frelio gives you a clean workspace for clients, projects, milestones,
              and invoices. Send professional invoices in minutes. Get paid through Khalti.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/register')}
                endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: SANS, fontSize: 14, fontWeight: 600,
                  color: '#fff', bgcolor: C.primary, textTransform: 'none',
                  px: 3.5, py: 1.35, borderRadius: 1.5,
                  '&:hover': { bgcolor: '#0A5A45' },
                }}
              >
                Start for free
              </Button>
              <Button
                component="a"
                href="#how-it-works"
                sx={{
                  fontFamily: SANS, fontSize: 14, fontWeight: 500,
                  color: C.text, textTransform: 'none',
                  px: 3.5, py: 1.35, borderRadius: 1.5,
                  border: `1px solid ${C.border}`,
                  '&:hover': { bgcolor: C.bgSubtle },
                }}
              >
                See how it works
              </Button>
            </Box>
          </Box>

          {/* App mockup */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, width: '100%' }}>
            <AppMockup />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

const PainSection = () => (
  <Box sx={{
    bgcolor: C.bgSubtle,
    py: { xs: 7, md: 11 },
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
  }}>
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Eyebrow label="Sound familiar?" />
        <Typography sx={{
          fontFamily: DISPLAY,
          fontSize: { xs: 28, md: 38 },
          fontWeight: 400,
          color: C.text,
          lineHeight: 1.2,
        }}>
          Freelancing in Nepal is hard enough without the admin work.
        </Typography>
      </Box>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}>
        {[
          {
            q: '"Which client owes me money right now?"',
            a: "Your invoices are split across Gmail, Drive, and a notebook. There's no single place to check.",
          },
          {
            q: '"Did they even see the invoice I sent?"',
            a: 'You attached a PDF to an email, then followed up on WhatsApp. You\'re still waiting.',
          },
          {
            q: '"This project is running long. Am I losing money?"',
            a: "You have no idea how much you've billed vs. how much is left. You're guessing.",
          },
        ].map(item => (
          <Box key={item.q} sx={{
            bgcolor: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            p: 3,
          }}>
            <Typography sx={{
              fontFamily: DISPLAY,
              fontSize: 15,
              fontStyle: 'italic',
              color: C.text,
              mb: 1.5,
              lineHeight: 1.4,
            }}>
              {item.q}
            </Typography>
            <Typography sx={{
              fontFamily: SANS,
              fontSize: 13,
              color: C.textSec,
              lineHeight: 1.65,
            }}>
              {item.a}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

const FeaturesSection = () => (
  <Box sx={{ bgcolor: C.bg, py: { xs: 7, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Eyebrow label="Features" />
        <Typography sx={{
          fontFamily: DISPLAY,
          fontSize: { xs: 28, md: 42 },
          fontWeight: 400,
          color: C.text,
          lineHeight: 1.15,
          maxWidth: 520,
        }}>
          Built around how you actually work.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}>
        {features.map(f => (
          <Box key={f.title} sx={{
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            p: 2.5,
            transition: 'border-color 0.15s ease',
            '&:hover': { borderColor: C.primary },
          }}>
            <Box sx={{
              width: 36, height: 36,
              bgcolor: C.primaryLight,
              borderRadius: 1.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.primary,
              mb: 2,
            }}>
              {f.icon}
            </Box>
            <Typography sx={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, mb: 0.75 }}>
              {f.title}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: 13, color: C.textSec, lineHeight: 1.65 }}>
              {f.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

const HowItWorksSection = () => (
  <Box
    id="how-it-works"
    sx={{
      bgcolor: C.bgSubtle,
      py: { xs: 7, md: 12 },
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
    }}
  >
    <Container maxWidth="lg">
      <Box sx={{ mb: 7 }}>
        <Eyebrow label="How it works" />
        <Typography sx={{
          fontFamily: DISPLAY,
          fontSize: { xs: 28, md: 42 },
          fontWeight: 400,
          color: C.text,
          lineHeight: 1.15,
        }}>
          From first client to paid invoice — in minutes.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
        gap: { xs: 4, md: 3 },
      }}>
        {steps.map(step => (
          <Box key={step.n} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{
              width: 36, height: 36,
              borderRadius: '50%',
              bgcolor: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Typography sx={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {step.n}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>
              {step.title}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: 13, color: C.textSec, lineHeight: 1.65 }}>
              {step.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

const ScreenshotsSection = () => (
  <Box sx={{ bgcolor: C.bg, py: { xs: 7, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Eyebrow label="See it in action" />
        <Typography sx={{
          fontFamily: DISPLAY,
          fontSize: { xs: 28, md: 42 },
          fontWeight: 400,
          color: C.text,
          lineHeight: 1.15,
        }}>
          Clean. Simple. Yours.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
      }}>
        {screenshots.map(s => (
          <Box key={s.file}>
            {/*
              Drop your screenshot files in /public/screenshots/<file>.png
              They will show automatically once added.
            */}
            <Box sx={{
              aspectRatio: '16 / 10',
              bgcolor: C.bgSubtle,
              border: `1px solid ${C.border}`,
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box
                component="img"
                src={`/screenshots/${s.file}.png`}
                alt={s.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {/* Shown only when no screenshot is found */}
              <Typography sx={{
                fontFamily: SANS, fontSize: 12,
                color: C.border, pointerEvents: 'none',
              }}>
                {s.title} — add /public/screenshots/{s.file}.png
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, mt: 1.5, mb: 0.5 }}>
              {s.title}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>
              {s.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

const CTASection = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: C.bgDark, py: { xs: 10, md: 18 } }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{
            fontFamily: DISPLAY,
            fontSize: { xs: 30, md: 46 },
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.12,
            mb: 2,
            letterSpacing: '-0.02em',
          }}>
            Your freelance work, properly managed.
          </Typography>
          <Typography sx={{
            fontFamily: SANS, fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            mb: 4.5,
          }}>
            Free to start. No credit card needed.
          </Typography>
          <Button
            onClick={() => navigate('/register')}
            endIcon={<ArrowForwardRounded sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: SANS, fontSize: 14, fontWeight: 600,
              color: C.bgDark, bgcolor: '#fff', textTransform: 'none',
              px: 4, py: 1.5, borderRadius: 1.5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.88)' },
            }}
          >
            Create your account
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

const Footer = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: C.bgDark, borderTop: `1px solid rgba(255,255,255,0.06)`, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Typography sx={{ fontFamily: DISPLAY, fontSize: 18, color: C.primary }}>
            Frelio
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            Built for Nepali freelancers · {new Date().getFullYear()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { label: 'Log in', path: '/login' },
              { label: 'Get started', path: '/register' },
            ].map(link => (
              <Typography
                key={link.label}
                onClick={() => navigate(link.path)}
                sx={{
                  fontFamily: SANS, fontSize: 13, cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)',
                  '&:hover': { color: 'rgba(255,255,255,0.75)' },
                  transition: 'color 0.15s ease',
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ── page ────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: C.bg, minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <HeroSection />
      <PainSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ScreenshotsSection />
      <CTASection />
      <Footer />
    </Box>
  )
}