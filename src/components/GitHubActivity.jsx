import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GITHUB_USER, GITHUB_URL } from '../data/config'
import { getProfile, getContributions } from '../data/github'
import ActivityHeatmap, { demoActivity } from './ActivityHeatmap'

const DEMO = import.meta.env.VITE_DEMO === '1'
const DEMO_PROFILE = { repos: 14, followers: 9, following: 11, since: 2023, stars: 6, langs: [['JavaScript', 7], ['HTML', 4], ['Python', 2], ['CSS', 2], ['Jupyter Notebook', 1]] }
const card = { border: '1px solid var(--border)', background: 'var(--surface)' }

export default function GitHubActivity() {
  const [profile, setProfile] = useState(DEMO ? DEMO_PROFILE : null)
  const [contrib, setContrib] = useState(DEMO ? demoActivity(11235, 0.7, 12) : null)
  const [pFail, setPFail] = useState(false)
  const [cFail, setCFail] = useState(false)

  useEffect(() => {
    if (DEMO) return
    let live = true
    getProfile(GITHUB_USER).then(d => live && setProfile(d)).catch(() => live && setPFail(true))
    getContributions(GITHUB_USER).then(d => live && setContrib(d)).catch(() => live && setCFail(true))
    return () => { live = false }
  }, [])

  const langTotal = profile ? profile.langs.reduce((a, [, n]) => a + n, 0) : 0
  const top = profile ? profile.langs.slice(0, 5) : []
  const tiles = profile ? [[profile.repos, 'Public repos'], [profile.stars, 'Stars earned'], [profile.followers, 'Followers'], [profile.following, 'Following']] : []
  const fail = <p className="font-mono text-xs" style={{ color: 'var(--c4)' }}>GitHub’s public API is unavailable right now (it rate-limits anonymous visitors). <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-text)' }}>View on GitHub ↗</a></p>

  return (
    <div>
      <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--c6)' }}>GitHub Activity · @{GITHUB_USER}</p>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-7 rounded-2xl relative" style={card}>
          {DEMO && <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded" style={{ background: 'var(--maroon)', color: 'var(--on-maroon)' }}>Sample · preview</span>}
          <p className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--c6)' }}>GitHub Stats</p>
          {pFail ? fail : !profile ? <p className="font-mono text-xs" style={{ color: 'var(--c4)' }}>Loading…</p> : (<>
            <div className="grid grid-cols-2 gap-6">
              {tiles.map(([v, l]) => (
                <div key={l}><div className="font-display text-3xl font-bold tabular-nums" style={{ color: 'var(--c1)' }}>{v}</div>
                  <div className="h-[2px] w-6 rounded-full my-2" style={{ background: 'var(--gold)' }} />
                  <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--c4)' }}>{l}</div></div>
              ))}
            </div>
            <p className="font-mono text-[10px] mt-6" style={{ color: 'var(--c6)' }}>On GitHub since {profile.since}</p>
          </>)}
        </div>

        <div className="p-7 rounded-2xl relative" style={card}>
          {DEMO && <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded" style={{ background: 'var(--maroon)', color: 'var(--on-maroon)' }}>Sample · preview</span>}
          <p className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--c6)' }}>Top Languages</p>
          {pFail ? fail : !profile ? <p className="font-mono text-xs" style={{ color: 'var(--c4)' }}>Loading…</p> : top.length === 0 ? <p className="font-mono text-xs" style={{ color: 'var(--c4)' }}>No language data yet.</p> : (<>
            <div className="grid gap-4">
              {top.map(([name, n], i) => {
                const pct = Math.round((n / langTotal) * 100)
                return (
                  <div key={name}>
                    <div className="flex justify-between mb-1.5 text-[13px]"><span style={{ color: 'var(--c3)' }}>{name}</span><span className="font-mono text-[11px]" style={{ color: 'var(--c6)' }}>{pct}% · {n} repo{n === 1 ? '' : 's'}</span></div>
                    <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'var(--elevated)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: 'var(--gold)', opacity: 1 - i * 0.14 }} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="font-mono text-[10px] mt-5" style={{ color: 'var(--c6)' }}>By number of your own (non-fork) repositories</p>
          </>)}
        </div>
      </div>

      <ActivityHeatmap title="GitHub Contributions" profileUrl={GITHUB_URL} data={contrib} failed={cFail} demo={DEMO} unit="contribution" thresholds={[3, 6, 10]}
        failText="Live GitHub contributions couldn’t be loaded right now. See the full graph on the profile ↗" />
    </div>
  )
}