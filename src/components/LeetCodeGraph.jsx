import { useEffect, useState } from 'react'
import { LEETCODE_USER, LEETCODE_URL } from '../data/config'
import ActivityHeatmap, { demoActivity } from './ActivityHeatmap'

// Preview builds set VITE_DEMO=1 to show sample data. Production always uses live data.
const DEMO = import.meta.env.VITE_DEMO === '1'
const SOURCES = [
  u => `https://alfa-leetcode-api.onrender.com/${u}/calendar`,
  u => `https://leetcode-api-faisalshohag.vercel.app/${u}`,
  u => `https://leetcode-stats-api.herokuapp.com/${u}`,
]

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
  const [data, setData] = useState(DEMO ? demoActivity() : null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (DEMO) return
    let live = true
    load(LEETCODE_USER).then(d => live && setData(d)).catch(() => live && setFailed(true))
    return () => { live = false }
  }, [])
  return <ActivityHeatmap title={`LeetCode Activity · @${LEETCODE_USER}`} profileUrl={LEETCODE_URL} data={data} failed={failed} demo={DEMO} unit="submission"
    failText="Live LeetCode data couldn’t be loaded right now. See the full activity on the profile ↗" />
}