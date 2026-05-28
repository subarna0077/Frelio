import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Box, Card, CardContent, Typography } from '@mui/material'
import type { Invoice } from '../../invoice/types/types'

// you must register the components you use — chart.js requires this
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface Props {
  invoices: Invoice[]
}

export const RevenueChart = ({ invoices }: Props) => {
  const data = useMemo(() => {
    const months: { label: string; year: number; month: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        label: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        month: date.getMonth(),
      })
    }

    return months.map(({ label, year, month }) => {
      const total = invoices
        .filter(inv => {
          if (inv.status !== 'paid' || !inv.paid_at) return false
          const paidDate = new Date(inv.paid_at)
          return paidDate.getMonth() === month && paidDate.getFullYear() === year
        })
        .reduce((sum, inv) => sum + inv.total, 0)

      return { label, total }
    })
  }, [invoices])

  const hasData = data.some(d => d.total > 0)

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: '#1D9E75',
        borderRadius: 4,
        label: 'Revenue (NPR)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `NPR ${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#F0F0F0' },
        ticks: {
          callback: (val: any) => val >= 1000 ? `${val / 1000}k` : val,
        },
      },
    },
  }

  return (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F0F0F0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Revenue — Last 6 Months
          </Typography>
        </Box>

        <Box sx={{ px: 2.5, py: 3 }}>
          {!hasData ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No revenue data yet. Paid invoices will appear here.
              </Typography>
            </Box>
          ) : (
            <Bar data={chartData} options={options as any} height={80} />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}