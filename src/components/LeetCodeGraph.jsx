import { useEffect, useMemo, useState } from 'react'
import { LEETCODE_USER, LEETCODE_URL } from '../data/config'

// Preview builds set VITE_DEMO=1 to show sample data. Production always uses live data.
const DEMO = import.meta.env.VITE_DEMO === '1'
const SOURCES = [
  u => `https://alfa-leetcode-api.onrender.com/${u}/calendar`,
  u => `https://leetcode-api-faisalshohag.vercel.app/${u}`,
  u => `https://leetcode-stats-api.herokuapp.com/${u}`,
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const LEVELS = ['var(--elevated)', 'rgba(var(--gold-rgb),0.32)', 'rgba(var(--gold-rgb),0.55)', 'rgba(var(--gold-rgb),0.78)', 'var(--gold)']
const level = n => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4)

function demoData() {
  let a = 20260903
  const rnd = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const out = {}, today = new Date()
  for (let i = 0; i < 371; i++) { const d = new Date(today); d.setDate(d.getDate() - i); if (rnd() < 0.62) out[key(d)] = 1 + Math.floor(rnd() * rnd() * 9) }
  return out
}

async function load(user) {
  for (const src of SOURCES) {
    try {
      const r = await fetch(src(user)); if (!r.ok) continue
      const d = await r.json()
      let cal = d.submissionCalendar; if (typeof cal === 'string') cal = JSON.parse(cal)
      if (!cal || typeof cal !== 'object') continue
      const out = {}
      for (const [ts, n] of Object.entries(cal)) { const k = new Date(+ts * 1000).toISOString().slice(0, 10); out[k] = (out[k] || 0) + n }
      return out
    } catch (e) { /* try next source */ }
  }
  throw new Error('unavailable')
}

export default function LeetCodeGraph() {
  const [data, setData] = useState(DEMO ? demoData() : null)
  const [failed, setFailed] = useState(false)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    if (DEMO) return
    let live = true
    load(LEETCODE_USER).then(d => live && setData(d)).catch(() => live && setFailed(true))
    return () => { live = false }
  }, [])

  const g = useMemo(() => {
    const end = new Date(); end.setHours(0, 0, 0, 0)
    const start = new Date(end); start.setDate(start.getDate() - 364 - end.getDay())
    const weeks = [], months = []
    for (let w = 0; w < 53; w++) {
      const col = []
      for (let d = 0; d < 7; d++) { const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d); col.push(dt > end ? null : dt) }
      weeks.push(col)
      const m = col[0].getMonth(); months.push(w === 0 || m !== weeks[w - 1][0].getMonth() ? MONTHS[m] : '')
    }
    if (months[1]) months[0] = ''
    let total = 0, active = 0, longest = 0, run = 0
    const days = weeks.flat().filter(Boolean)
    for (const dt of days) { const n = data?.[key(dt)] || 0; total += n; if (n) { active++; run++; longest = Math.max(longest, run) } else run = 0 }
    let current = 0
    for (let i = days.length - 1; i >= 0; i--) { const n = data?.[key(days[i])] || 0; if (n) current++; else if (i !== days.length - 1) break }
    return { weeks, months, total, active, longest, current }
  }, [data])

  const summary = [[g.total, 'Submissions (1 yr)'], [g.active, 'Active days'], [g.current, 'Current streak'], [g.longest, 'Longest streak']]

  return (
    <div className="p-7 rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--c6)' }}>LeetCode Activity · @{LEETCODE_USER}</p>
        {DEMO && <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded" style={{ background: 'var(--maroon)', color: 'var(--on-maroon)' }}>Sample data · preview only</span>}
        <a href={LEETCODE_URL} target="_blank" rel="noreferrer" className="text-xs" style={{ color: 'var(--gold-text)' }}>View profile ↗</a>
      </div>

      {!data && !failed && <p className="font-mono text-xs" style={{ color: 'var(--c4)' }}>Loading LeetCode activity…</p>}
      {failed && <p className="font-mono text-xs" style={{ color: 'var(--c4)' }}>Live LeetCode data couldn’t be loaded right now. See the full activity on the profile ↗</p>}

      {data && (<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {summary.map(([v, l]) => (
            <div key={l}><div className="font-display text-2xl font-bold tabular-nums" style={{ color: 'var(--c1)' }}>{v}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase mt-1" style={{ color: 'var(--c4)' }}>{l}</div></div>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <div style={{ width: 'max-content' }}>
            <div className="flex mb-2 font-mono text-[10px]" style={{ color: 'var(--c4)' }}>
              {g.months.map((m, i) => <span key={i} style={{ width: 15, flex: 'none', whiteSpace: 'nowrap', overflow: 'visible' }}>{m}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 12px)', gridAutoFlow: 'column', gridAutoColumns: '12px', gap: 3 }}>
              {g.weeks.map((col, w) => col.map((dt, d) => {
                if (!dt) return <span key={`${w}-${d}`} />
                const n = data[key(dt)] || 0
                return <span key={`${w}-${d}`} title={`${n} submission${n === 1 ? '' : 's'} on ${dt.toDateString()}`}
                  onMouseEnter={() => setHover(`${n} submission${n === 1 ? '' : 's'} on ${dt.toDateString()}`)} onMouseLeave={() => setHover(null)}
                  style={{ borderRadius: 3, background: LEVELS[level(n)], animation: `cellIn .45s ${w * 14}ms both` }} />
              }))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <span className="font-mono text-xs min-h-[1rem]" style={{ color: 'var(--gold-text)' }}>{hover || 'Hover a day to see submissions'}</span>
          <div className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: 'var(--c4)' }}>
            Less {LEVELS.map((c, i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, display: 'inline-block' }} />)} More
          </div>
        </div>
      </>)}
    </div>
  )
}
