import { Box, Typography, Button, Container } from '@mui/material'
import {
  CheckCircleOutlined,
  ArrowForwardRounded,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// ── tokens ────────────────────────────────────────────────────────────────────

const C = {
  bg: '#FAFAF8',
  bgDark: '#0D2218',
  primary: '#0F6E56',
  primaryLight: '#E1F5EE',
  ink: '#111210',
  mid: '#64635F',
  rule: '#E0E0DC',
}

const DISPLAY = "'DM Serif Display', Georgia, serif"
const SANS = "'DM Sans', system-ui, sans-serif"

// ── AppMockup (unchanged — it's good) ────────────────────────────────────────

const AppMockup = () => (
  <Box sx={{
    border: `1.5px solid ${C.rule}`,
    borderRadius: 2.5,
    overflow: 'hidden',
    bgcolor: '#fff',
    boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: 420,
    userSelect: 'none',
    flexShrink: 0,
  }}>
    {/* Browser chrome */}
    <Box sx={{
      px: 2, py: 1.25,
      bgcolor: C.bg,
      borderBottom: `1px solid ${C.rule}`,
      display: 'flex', alignItems: 'center', gap: 0.75,
    }}>
      {['#F87171', '#FBBF24', '#34D399'].map((c, i) => (
        <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c, opacity: 0.55 }} />
      ))}
      <Box sx={{
        ml: 1, flex: 1, height: 20,
        bgcolor: '#fff', border: `1px solid ${C.rule}`,
        borderRadius: 0.75, display: 'flex', alignItems: 'center', px: 1,
      }}>
        <Typography sx={{ fontFamily: SANS, fontSize: 10, color: C.mid }}>
          frelio.vercel.app/invoices/INV-2025-004
        </Typography>
      </Box>
    </Box>

    {/* Invoice content */}
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1 }}>
            INV-2025-004
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, color: C.mid, mt: 0.4 }}>
            Himalayan Threads · Website Redesign
          </Typography>
        </Box>
        <Box sx={{ px: 1.25, py: 0.4, bgcolor: C.primaryLight, borderRadius: 1 }}>
          <Typography sx={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.primary }}>Paid</Typography>
        </Box>
      </Box>

      {[
        { label: 'UI/UX Design & Wireframing', amt: 'NPR 8,000' },
        { label: 'Frontend Development', amt: 'NPR 22,000' },
        { label: 'Backend & CMS Integration', amt: 'NPR 15,000' },
        { label: 'Testing & Launch', amt: 'NPR 8,000' },
      ].map(item => (
        <Box key={item.label} sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          py: 0.8, borderBottom: `1px solid ${C.rule}`,
        }}>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, color: C.mid }}>{item.label}</Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: C.ink }}>{item.amt}</Typography>
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5 }}>
        <Typography sx={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.ink }}>Total</Typography>
        <Typography sx={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: C.primary }}>NPR 53,000</Typography>
      </Box>

      <Box sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${C.rule}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontFamily: SANS, fontSize: 11, color: C.mid }}>Milestone progress</Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: C.primary }}>4 of 4 paid</Typography>
        </Box>
        <Box sx={{ height: 4, bgcolor: C.rule, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: '100%', bgcolor: C.primary, borderRadius: 2 }} />
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <CheckCircleOutlined sx={{ fontSize: 14, color: C.primary }} />
        <Typography sx={{ fontFamily: SANS, fontSize: 11, color: C.mid }}>
          Paid via Khalti · 15 Mar 2025
        </Typography>
      </Box>
    </Box>
  </Box>
)

// ── Navbar — stripped down ────────────────────────────────────────────────────

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky', top: 0, zIndex: 100,
        bgcolor: 'rgba(250,250,248,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${C.rule}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Typography sx={{ fontFamily: DISPLAY, fontSize: 21, color: C.primary }}>
            Frelio
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
            <Typography
              onClick={() => navigate('/login')}
              sx={{
                fontFamily: SANS, fontSize: 13, color: C.mid,
                cursor: 'pointer', userSelect: 'none',
                '&:hover': { color: C.ink },
                transition: 'color 0.12s',
              }}
            >
              Log in
            </Typography>
            <Typography
              onClick={() => navigate('/register')}
              sx={{
                fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.primary,
                cursor: 'pointer', userSelect: 'none',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
                textDecorationThickness: 1.5,
                '&:hover': { color: '#0A5A45' },
                transition: 'color 0.12s',
              }}
            >
              Get started
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ── Hero — asymmetric 65/35 ───────────────────────────────────────────────────

const HeroSection = () => {
  const navigate = useNavigate()
  return (
    <Box sx={{ bgcolor: C.bg, pt: { xs: 7, md: 9 }, pb: { xs: 7, md: 9 }, overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 6, md: 5 },
        }}>

          {/* Text — 65% */}
          <Box sx={{ flex: '0 0 62%', maxWidth: { md: '62%' } }}>
            {/* Label */}
            <Typography sx={{
              fontFamily: SANS, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.primary, mb: 3,
            }}>
              For Nepali freelancers
            </Typography>

            {/* Headline — big, left-aligned, intentional break */}
            <Typography
              component="h1"
              sx={{
                fontFamily: DISPLAY,
                fontSize: { xs: 44, sm: 58, md: 72, lg: 84 },
                fontWeight: 400,
                color: C.ink,
                lineHeight: 1.03,
                letterSpacing: '-0.03em',
                mb: 4,
              }}
            >
              Stop tracking your
              <br />work in{' '}
              <Box component="span" sx={{ color: C.primary, fontStyle: 'italic' }}>
                WhatsApp.
              </Box>
            </Typography>

            <Typography sx={{
              fontFamily: SANS, fontSize: 15, color: C.mid,
              lineHeight: 1.75, maxWidth: 420, mb: 4.5,
            }}>
              Frelio handles your clients, projects, milestones, and invoices.
              Send a professional invoice in minutes. Get paid through Khalti.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/register')}
                endIcon={<ArrowForwardRounded sx={{ fontSize: 15 }} />}
                sx={{
                  fontFamily: SANS, fontSize: 13, fontWeight: 600,
                  color: '#fff', bgcolor: C.primary, textTransform: 'none',
                  px: 3.5, py: 1.25, borderRadius: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#0A5A45', boxShadow: 'none' },
                }}
              >
                Start for free
              </Button>
              <Typography
                component="a"
                href="#how-it-works"
                sx={{
                  fontFamily: SANS, fontSize: 13, color: C.mid,
                  textDecoration: 'underline', textUnderlineOffset: 3,
                  textDecorationThickness: 1,
                  cursor: 'pointer',
                  '&:hover': { color: C.ink },
                }}
              >
                See how it works
              </Typography>
            </Box>
          </Box>

          {/* Mockup — 35%, pulled up slightly */}
          <Box sx={{
            flex: '0 0 38%',
            mt: { md: -3 },
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            width: '100%',
          }}>
            <AppMockup />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

// ── Pain — one big typographic quote, not a card grid ────────────────────────

const PainSection = () => (
  <Box sx={{
    bgcolor: C.bgDark,
    py: { xs: 9, md: 14 },
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Background word */}
    <Box sx={{
      position: 'absolute',
      bottom: -20,
      right: -10,
      fontFamily: DISPLAY,
      fontSize: { xs: 120, md: 220 },
      fontWeight: 400,
      color: 'rgba(255,255,255,0.025)',
      lineHeight: 1,
      userSelect: 'none',
      pointerEvents: 'none',
      letterSpacing: '-0.04em',
    }}>
      invoices
    </Box>

    <Container maxWidth="lg">
      {/* Eyebrow */}
      <Typography sx={{
        fontFamily: SANS, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: C.primary, mb: 4,
      }}>
        Sound familiar?
      </Typography>

      {/* The big question */}
      <Typography sx={{
        fontFamily: DISPLAY,
        fontSize: { xs: 30, md: 46, lg: 56 },
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#fff',
        lineHeight: 1.15,
        maxWidth: 720,
        mb: 6,
        letterSpacing: '-0.02em',
      }}>
        "Which client owes me money right now?"
      </Typography>

      {/* Three answers — horizontal, no card borders */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: { xs: 4, md: 6 },
        borderTop: '1px solid rgba(255,255,255,0.08)',
        pt: 5,
      }}>
        {[
          {
            q: 'Did they even see my invoice?',
            a: 'You attached a PDF to an email, then followed up on WhatsApp. Still waiting.',
          },
          {
            q: 'Am I losing money on this project?',
            a: "You have no idea what you've billed versus what's left. You're guessing.",
          },
          {
            q: `Where did I save that client's phone number?`,
            a: 'Somewhere between your notebook, Gmail, and a voice note. Probably.',
          },
        ].map(item => (
          <Box key={item.q}>
            <Typography sx={{
              fontFamily: DISPLAY,
              fontSize: 18,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.65)',
              mb: 1.25,
              lineHeight: 1.4,
            }}>
              {item.q}
            </Typography>
            <Typography sx={{
              fontFamily: SANS, fontSize: 13, color: 'rgba(255,255,255,0.3)',
              lineHeight: 1.7,
            }}>
              {item.a}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

// ── Features — prose, not icon cards ─────────────────────────────────────────

const FeaturesSection = () => (
  <Box sx={{ bgcolor: C.bg, py: { xs: 8, md: 11 }, borderBottom: `1px solid ${C.rule}` }}>
    <Container maxWidth="lg">
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 6, md: 12 },
        alignItems: 'start',
      }}>

        {/* Left — label + heading */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 80 } }}>
          <Typography sx={{
            fontFamily: SANS, fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.primary, mb: 2,
          }}>
            What's inside
          </Typography>
          <Typography sx={{
            fontFamily: DISPLAY,
            fontSize: { xs: 34, md: 48 },
            fontWeight: 400,
            color: C.ink,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Built around how you actually work.
          </Typography>
        </Box>

        {/* Right — prose */}
        <Box>
          <Typography sx={{
            fontFamily: SANS, fontSize: 15, color: C.mid,
            lineHeight: 1.85, mb: 4,
          }}>
            You get a <strong style={{ color: C.ink }}>client list</strong> — real names, emails, linked projects,
            full history. Not a spreadsheet you forgot to update.
            Each client has <strong style={{ color: C.ink }}>projects</strong> with deadlines and
            statuses. Each project has <strong style={{ color: C.ink }}>milestones</strong> — phases
            of work with prices attached. That's your billing plan, done before the work starts.
          </Typography>
          <Typography sx={{
            fontFamily: SANS, fontSize: 15, color: C.mid,
            lineHeight: 1.85, mb: 4,
          }}>
            When a milestone is done, generate an <strong style={{ color: C.ink }}>invoice</strong> in
            one click. It pulls the line items automatically. Send it by email or share a
            link — your client gets a <strong style={{ color: C.ink }}>client portal</strong>,
            a clean page where they can review the work and pay via Khalti. No account
            needed on their end.
          </Typography>
          <Typography sx={{
            fontFamily: SANS, fontSize: 15, color: C.mid,
            lineHeight: 1.85,
          }}>
            Your <strong style={{ color: C.ink }}>dashboard</strong> shows revenue over time,
            active projects, and what's been paid. You stop guessing and start knowing.
          </Typography>
        </Box>
      </Box>
    </Container>
  </Box>
)

// ── How it works — skewed section for the "off" element ──────────────────────

const HowItWorksSection = () => (
  <Box
    id="how-it-works"
    sx={{
      position: 'relative',
      bgcolor: C.bg,
      py: { xs: 10, md: 14 },
      // Skew the background, not the content
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        bgcolor: C.primaryLight,
        transform: 'skewY(-2.5deg)',
        zIndex: 0,
      },
    }}
  >
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ mb: 7 }}>
        <Typography sx={{
          fontFamily: SANS, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: C.primary, mb: 2,
        }}>
          How it works
        </Typography>
        <Typography sx={{
          fontFamily: DISPLAY,
          fontSize: { xs: 30, md: 46 },
          fontWeight: 400,
          color: C.ink,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          From first client to paid invoice.
        </Typography>
      </Box>

      {/* Steps — horizontal, number is just a character */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
        gap: { xs: 5, md: 2 },
      }}>
        {[
          { n: '01', title: 'Add your client', desc: 'Name, email, phone. One short form. Done in under a minute.' },
          { n: '02', title: 'Create a project', desc: 'Link it to the client. Set a title and dates. The project code is auto-generated.' },
          { n: '03', title: 'Set milestones', desc: 'Break the work into phases, each with an amount and due date. This is your billing plan.' },
          { n: '04', title: 'Send an invoice', desc: 'When a milestone is done, generate an invoice and hit send. The client gets a link.' },
          { n: '05', title: 'Get paid', desc: 'They open the link, review the invoice, and pay via Khalti. Status updates automatically.' },
        ].map((step, i) => (
          <Box key={step.n} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{
              fontFamily: DISPLAY,
              fontSize: 36,
              color: C.primary,
              lineHeight: 1,
              opacity: 0.35,
              mb: 0.5,
            }}>
              {step.n}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
              {step.title}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: 12, color: C.mid, lineHeight: 1.7 }}>
              {step.desc}
            </Typography>
            {i < 4 && (
              <Box sx={{
                display: { xs: 'none', md: 'block' },
                mt: 'auto', pt: 2,
                borderBottom: `1px dashed ${C.rule}`,
              }} />
            )}
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

// ── Screenshots ───────────────────────────────────────────────────────────────

const screenshots = [
  { file: 'dashboard', title: 'Dashboard', desc: 'Revenue, recent activity, and upcoming deadlines — all at a glance.' },
  { file: 'client', title: 'Client detail', desc: 'Every detail about a client in one place — projects, invoices, contacts.' },
  { file: 'project_page', title: 'Projects', desc: 'Milestones, progress, status, and amounts. All in one view.' },
  { file: 'milestone_creation', title: 'Add a milestone', desc: 'Set the phase name, price, and due date. That\'s your billing plan.' },
  { file: 'invoice', title: 'Generate invoices', desc: 'One click from a completed milestone. Line items filled automatically.' },
  { file: 'public_portal', title: 'Client portal', desc: 'What your client sees. They can review and pay — no account needed.' },
]

const ScreenshotsSection = () => (
  <Box sx={{ bgcolor: C.bg, py: { xs: 8, md: 12 } }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography sx={{
          fontFamily: SANS, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: C.primary, mb: 2,
        }}>
          See it in action
        </Typography>
        <Typography sx={{
          fontFamily: DISPLAY,
          fontSize: { xs: 28, md: 44 },
          fontWeight: 400,
          color: C.ink,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          Every screen, exactly as it is.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
      }}>
        {screenshots.map(s => (
          <Box key={s.file}>
            <Box sx={{
              border: `1.5px solid ${C.rule}`,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              {/* browser chrome */}
              <Box sx={{
                px: 2, py: 1.25, bgcolor: C.bg,
                borderBottom: `1px solid ${C.rule}`,
                display: 'flex', alignItems: 'center', gap: 0.75,
              }}>
                {['#F87171', '#FBBF24', '#34D399'].map((c, i) => (
                  <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c, opacity: 0.55 }} />
                ))}
              </Box>
              <Box sx={{
                aspectRatio: '16 / 10',
                bgcolor: '#F2F2EF',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                <Typography sx={{ fontFamily: SANS, fontSize: 11, color: C.rule, pointerEvents: 'none' }}>
                  /screenshots/{s.file}.png
                </Typography>
              </Box>
            </Box>
            <Box sx={{ pt: 1.75, pb: 0.5, pl: 0.25 }}>
              <Typography sx={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.ink, mb: 0.25 }}>
                {s.title}
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: 12, color: C.mid, lineHeight: 1.6 }}>
                {s.desc}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
)

// ── CTA ───────────────────────────────────────────────────────────────────────

const CTASection = () => {
  const navigate = useNavigate()
  return (
    <Box sx={{ bgcolor: C.bgDark, py: { xs: 11, md: 18 }, position: 'relative', overflow: 'hidden' }}>
      {/* Big background character */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: DISPLAY,
        fontSize: { xs: 180, md: 360 },
        fontWeight: 400,
        color: 'rgba(255,255,255,0.018)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.06em',
      }}>
        Frelio
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Left-aligned, not centered */}
        <Box>
          <Typography sx={{
            fontFamily: DISPLAY,
            fontSize: { xs: 34, md: 58 },
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.08,
            mb: 2,
            letterSpacing: '-0.025em',
            maxWidth: 540,
          }}>
            Your freelance work,
            <br />
            <Box component="span" sx={{ fontStyle: 'italic', color: C.primary }}>
              properly managed.
            </Box>
          </Typography>
          <Typography sx={{
            fontFamily: SANS, fontSize: 14,
            color: 'rgba(255,255,255,0.35)',
            mb: 5,
          }}>
            Free to start. No credit card.
          </Typography>
          <Button
            onClick={() => navigate('/register')}
            endIcon={<ArrowForwardRounded sx={{ fontSize: 15 }} />}
            sx={{
              fontFamily: SANS, fontSize: 13, fontWeight: 600,
              color: C.bgDark, bgcolor: '#fff', textTransform: 'none',
              px: 4, py: 1.35, borderRadius: 1.5,
              boxShadow: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.88)', boxShadow: 'none' },
            }}
          >
            Create your account
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => {
  const navigate = useNavigate()
  return (
    <Box sx={{ bgcolor: C.bgDark, borderTop: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
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
          <Typography sx={{ fontFamily: SANS, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
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
                  color: 'rgba(255,255,255,0.3)',
                  '&:hover': { color: 'rgba(255,255,255,0.65)' },
                  transition: 'color 0.12s',
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

// ── Page ──────────────────────────────────────────────────────────────────────

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