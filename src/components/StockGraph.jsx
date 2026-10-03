import { useRef, useState, useMemo, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const GITHUB_USERNAME = 'Adityashaw2865'
const WIDTH = 700
const HEIGHT = 260
const PAD_X = 20
const PAD_Y = 24

// Preview builds set VITE_DEMO=1 to show sample data (hosted previews can't call external APIs).
const DEMO = import.meta.env.VITE_DEMO === '1'
function sampleDays() {
  let a = 7654321
  const rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const out = []
  for (let i = 364; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const g = 0.35 + 0.65 * (364 - i) / 364; out.push({ date: d.toISOString().slice(0, 10), count: rnd() < 0.7 ? Math.floor(rnd() * 9 * g) + 1 : 0 }) }
  return out
}

function monthKey(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('en', { month: 'short' })
}

export default function StockGraph() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [hoverIdx, setHoverIdx] = useState(null)
  const [monthlyData, setMonthlyData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    async function fetchContributions() {
      try {
        let days
        if (DEMO) { days = sampleDays() } else {
          const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
          if (!res.ok) throw new Error('bad response')
          const json = await res.json()
          days = json.contributions || []
        }

        const totals = {}
        days.forEach(d => {
          const key = monthKey(d.date)
          totals[key] = (totals[key] || 0) + (d.count || 0)
        })

        const sortedKeys = Object.keys(totals).sort()
        const last12 = sortedKeys.slice(-12)
        const result = last12.map(key => ({ label: monthLabel(key), value: totals[key] }))

        if (!cancelled) {
          setMonthlyData(result)
          setStatus('ok')
        }
      } catch (err) {
        if (!cancelled) setStatus('error')
      }
    }
    fetchContributions()
    return () => { cancelled = true }
  }, [])

  const chart = useMemo(() => {
    if (!monthlyData || monthlyData.length < 2) return null

    const values = monthlyData.map(d => d.value)
    const minVal = Math.min(...values)
    const maxVal = Math.max(...values)
    const range = maxVal - minVal || 1
    const stepX = (WIDTH - PAD_X * 2) / (monthlyData.length - 1)

    const points = monthlyData.map((d, i) => {
      const x = PAD_X + i * stepX
      const y = HEIGHT - PAD_Y - ((d.value - minVal) / range) * (HEIGHT - PAD_Y * 2)
      return { x, y, ...d }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PAD_Y} L ${points[0].x} ${HEIGHT - PAD_Y} Z`

    return { linePath, areaPath, points }
  }, [monthlyData])

  if (status === 'loading') {
    return (
      <div className="rounded-2xl p-6 flex items-center justify-center"
        style={{ border: '1px solid rgba(var(--c4-rgb),0.08)', background: 'rgba(var(--c4-rgb),0.02)', minHeight: 260 }}>
        <p className="font-mono text-xs" style={{ color: 'var(--c9)' }}>Fetching GitHub activity…</p>
      </div>
    )
  }

  if (status === 'error' || !chart) {
    return (
      <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer"
        className="rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-colors duration-200"
        style={{ border: '1px solid rgba(var(--c4-rgb),0.08)', background: 'rgba(var(--c4-rgb),0.02)', minHeight: 260, color: 'var(--c7)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--c1)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--c7)'}>
        <span className="font-mono text-xs">Couldn't load GitHub activity</span>
        <span className="font-mono text-xs" style={{ color: 'var(--c4)' }}>View on GitHub ↗</span>
      </a>
    )
  }

  const { points, linePath, areaPath } = chart
  const active = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1]

  const baselineSlice = points.slice(0, Math.min(3, points.length))
  const baseline = baselineSlice.reduce((sum, p) => sum + p.value, 0) / baselineSlice.length
  const last = points[points.length - 1].value
  const isUp = last >= baseline
  const rawPct = baseline > 0 ? ((last - baseline) / baseline) * 100 : 0
  const growthPct = Math.max(-999, Math.min(999, Math.round(rawPct)))

  return (
    <div ref={ref} className="rounded-2xl p-6 overflow-hidden relative"
      style={{ border: '1px solid rgba(var(--c4-rgb),0.08)', background: 'rgba(var(--c4-rgb),0.02)' }}>
      {DEMO && <span className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded" style={{ background: 'var(--maroon)', color: 'var(--on-maroon)' }}>Sample data · preview only</span>}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--c6)' }}>
            GitHub Contributions / Month
          </p>
          <p className="font-display text-2xl font-bold" style={{ color: 'var(--c1)' }}>
            {active.value}
            <span className="text-sm font-normal ml-1" style={{ color: 'var(--c9)' }}>commits · {active.label}</span>
          </p>
        </div>
        <span className="font-mono text-xs px-3 py-1.5 rounded-lg"
          style={{
            background: isUp ? 'rgba(var(--chart-up-rgb),0.1)' : 'rgba(var(--chart-down-rgb),0.1)',
            color: isUp ? 'var(--chart-up)' : 'var(--chart-down)',
            border: isUp ? '1px solid rgba(var(--chart-up-rgb),0.25)' : '1px solid rgba(var(--chart-down-rgb),0.25)',
          }}>
          {isUp ? '▲' : '▼'} {Math.abs(growthPct)}%
        </span>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ minWidth: 480 }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map(i => (
            <line key={i}
              x1={PAD_X} x2={WIDTH - PAD_X}
              y1={PAD_Y + (i * (HEIGHT - PAD_Y * 2)) / 3}
              y2={PAD_Y + (i * (HEIGHT - PAD_Y * 2)) / 3}
              stroke="rgba(var(--chart-grid-rgb),0.08)" strokeWidth="1"
            />
          ))}

          <motion.path
            d={areaPath}
            fill="url(#stockFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="var(--chart-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x} cy={p.y}
                r={hoverIdx === i ? 5 : 3}
                fill="var(--chart-line)"
                stroke="var(--bg)"
                strokeWidth="2"
                style={{ transition: 'r 0.15s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoverIdx(i)}
              />
              <rect
                x={p.x - (WIDTH / points.length) / 2}
                y={0}
                width={WIDTH / points.length}
                height={HEIGHT}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
              />
            </g>
          ))}

          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={HEIGHT - 4}
              textAnchor="middle"
              fontSize="10"
              fontFamily="monospace"
              fill="var(--c9)"
              opacity={hoverIdx === i ? 1 : 0.6}
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
