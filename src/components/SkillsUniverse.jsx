import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillGroups } from '../data/skills'

/* Interactive 3D skills map — pure canvas, no extra dependencies.
   Drag = rotate · Ctrl/⌘ + scroll or +/- = zoom · click a skill = pin it. */

const PAL = {
  dark:  { Languages: [212, 175, 55], Frontend: [255, 153, 51], Backend: [96, 165, 230], Databases: [240, 230, 205], 'ML / AI': [224, 96, 96], Tools: [169, 174, 182] },
  light: { Languages: [184, 146, 31], Frontend: [214, 110, 10], Backend: [15, 76, 129], Databases: [138, 110, 60], 'ML / AI': [150, 35, 35], Tools: [100, 116, 139] },
}
const RADII = [92, 128, 164, 200, 236, 272]
const TILT = [0.18, -0.32, 0.42, -0.2, 0.34, -0.4]
const NODE = [0, 1.05, 2.1, 3.15, 4.2, 5.25]
const CATS = skillGroups.map(g => g.category)
const NODES = skillGroups.flatMap((g, k) => g.items.map((s, i) => ({ id: `${g.category}:${s.name}`, name: s.name, category: g.category, level: s.level, k, phase: (i / g.items.length) * Math.PI * 2 + k * 0.7 })))
NODES.forEach((n, i) => { n.i = i })
const BY_ID = Object.fromEntries(NODES.map(n => [n.id, n]))
const FONT = '"DM Mono", ui-monospace, monospace'
const levelLabel = n => (n >= 85 ? 'Expert' : n >= 75 ? 'Strong' : n >= 65 ? 'Comfortable' : 'Learning')
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const ease = t => 1 - Math.pow(1 - t, 3)

function makeStars() {
  let a = 424242
  const r = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  return Array.from({ length: 120 }, () => ({ x: r(), y: r(), d: 0.3 + r() * 0.7, s: 0.5 + r() * 1.2, tw: r() * 6.28 }))
}

function project(s, k, R, th, out) {
  let x = R * Math.cos(th), y = 0, z = R * Math.sin(th)
  const ct = Math.cos(TILT[k]), st = Math.sin(TILT[k])
  let y1 = y * ct - z * st, z1 = y * st + z * ct; y = y1; z = z1
  const cn = Math.cos(NODE[k]), sn = Math.sin(NODE[k])
  let x2 = x * cn + z * sn, z2 = -x * sn + z * cn; x = x2; z = z2
  const cy = Math.cos(s.yaw), sy = Math.sin(s.yaw)
  x2 = x * cy + z * sy; z2 = -x * sy + z * cy; x = x2; z = z2
  const cp = Math.cos(s.pitch), sp = Math.sin(s.pitch)
  y1 = y * cp - z * sp; z1 = y * sp + z * cp; y = y1; z = z1
  const m = s.U * s.zoom
  x *= m; y *= m; z *= m
  const sc = 900 / (900 + z)
  out.x = s.W / 2 + x * sc; out.y = s.H / 2 + 6 + y * sc; out.sc = sc; out.z = z
  return out
}

export default function SkillsUniverse() {
  const wrap = useRef(null), canvas = useRef(null), tipEl = useRef(null)
  const [filter, setFilter] = useState(null)
  const [tip, setTip] = useState(null)
  const [pin, setPin] = useState(false)
  const [theme, setTheme] = useState(() => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'))
  const S = useRef(null)
  if (!S.current) S.current = {
    yaw: 0.6, pitch: 1.05, vyaw: 0, vpitch: 0, zoom: 0.7, zoomT: 1, t: 0, timeScale: 1, appearT: 0, started: false, visible: false,
    dragging: false, moved: 0, hover: null, pinned: null, filter: null, mouse: null, items: [], tipId: null,
    ca: CATS.map(() => 1), cr: [...RADII], W: 0, H: 0, U: 1, last: 0, theme, reduce: false, stars: makeStars(),
  }

  useEffect(() => { // follow site theme
    const mo = new MutationObserver(() => { const t = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; setTheme(t); S.current.theme = t })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  useEffect(() => { // filter changes → camera + pin
    const s = S.current; s.filter = filter; s.zoomT = filter ? 1.12 : 1
    if (s.pinned && filter && BY_ID[s.pinned].category !== filter) { s.pinned = null; setPin(false) }
  }, [filter])

  useEffect(() => {
    const s = S.current, cv = canvas.current, wr = wrap.current, ctx = cv.getContext('2d')
    s.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (s.reduce) { s.appearT = 1; s.zoom = 1 }
    if (import.meta.env.DEV || import.meta.env.VITE_DEMO === '1') window.__uni = s

    const resize = () => {
      const W = wr.clientWidth, H = W < 640 ? 440 : 580, dpr = Math.min(2, window.devicePixelRatio || 1)
      s.W = W; s.H = H; s.U = Math.min(W / (W < 640 ? 620 : 900), H / 560)
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(wr)
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (e.intersectionRatio > 0.2) s.started = true }, { threshold: [0, 0.2] })
    io.observe(wr)

    const hitAt = (x, y) => {
      for (let i = s.items.length - 1; i >= 0; i--) { const it = s.items[i]; if (it.n && it.a > 0.35 && Math.hypot(x - it.x, y - it.y) <= it.r + 9) return it.n.id }
      return null
    }
    const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    let lx = 0, ly = 0
    const down = e => { s.dragging = true; s.moved = 0; lx = e.clientX; ly = e.clientY; s.mouse = pos(e); try { cv.setPointerCapture(e.pointerId) } catch (er) {} }
    const move = e => {
      s.mouse = pos(e)
      if (!s.dragging) return
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; s.moved += Math.abs(dx) + Math.abs(dy)
      s.yaw += dx * 0.006; s.pitch = clamp(s.pitch + dy * 0.004, 0.3, 1.45)
      s.vyaw = lerp(s.vyaw, dx * 0.006, 0.5); s.vpitch = lerp(s.vpitch, dy * 0.004, 0.5)
    }
    const up = e => {
      if (s.dragging && s.moved < 5) { const id = hitAt(pos(e).x, pos(e).y); s.pinned = id && id !== s.pinned ? id : null; setPin(!!s.pinned) }
      s.dragging = false
    }
    const leave = () => { s.mouse = null; s.hover = null }
    const wheel = e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); s.zoomT = clamp(s.zoomT * Math.exp(-e.deltaY * 0.01), 0.6, 2.2) } }
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up)
    cv.addEventListener('pointerleave', leave); cv.addEventListener('wheel', wheel, { passive: false })

    const tmp = { x: 0, y: 0, sc: 1, z: 0 }
    let raf
    const frame = now => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016); s.last = now
      if (!s.visible || !s.W) return
      const { W, H } = s, pal = PAL[s.theme], dark = s.theme === 'dark'
      const k1 = 1 - Math.pow(0.0008, dt), k2 = 1 - Math.pow(0.03, dt)

      if (s.started && s.appearT < 1) s.appearT = Math.min(1, s.appearT + dt / 1.8)
      const ap = s.reduce ? 1 : ease(s.appearT)
      const calm = s.hover || s.pinned || s.dragging
      s.timeScale = lerp(s.timeScale, s.reduce ? 0 : calm ? 0.1 : 1, k2)
      s.t += dt * s.timeScale
      if (!s.dragging) {
        s.yaw += (s.vyaw + (s.reduce ? 0 : 0.0014 * (calm ? 0.2 : 1))) * dt * 60
        s.pitch = clamp(s.pitch + s.vpitch * dt * 60, 0.3, 1.45)
        const damp = Math.pow(0.9, dt * 60); s.vyaw *= damp; s.vpitch *= damp
      }
      s.zoom += (s.zoomT - s.zoom) * k1

      const activeId = s.hover || s.pinned, activeCat = activeId ? BY_ID[activeId].category : null
      CATS.forEach((c, k) => {
        const vis = s.filter ? (c === s.filter ? 1 : 0.07) : 1
        const emph = activeCat && !s.filter ? (c === activeCat ? 1 : 0.4) : 1
        s.ca[k] += (vis * emph - s.ca[k]) * k1
        const rt = s.filter ? (c === s.filter ? 195 : RADII[k] * 0.5) : RADII[k]
        s.cr[k] += (rt - s.cr[k]) * k2
      })

      ctx.clearRect(0, 0, W, H)
      const txt = a => (dark ? `rgba(255,253,247,${a})` : `rgba(30,41,59,${a})`)

      // starfield (parallax)
      for (const st of s.stars) {
        const x = (((st.x * W + s.yaw * 40 * st.d) % W) + W) % W, y = (((st.y * H + s.pitch * 30 * st.d) % H) + H) % H
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.t * 1.5 + st.tw))
        ctx.fillStyle = dark ? `rgba(255,255,255,${0.5 * tw * st.d * ap})` : `rgba(184,146,31,${0.35 * tw * st.d * ap})`
        ctx.beginPath(); ctx.arc(x, y, st.s * st.d, 0, 6.283); ctx.fill()
      }

      // orbit rings
      CATS.forEach((c, k) => {
        const a = s.ca[k] * Math.min(1, ap * 1.4); if (a < 0.01) return
        const R = s.cr[k] * ap, col = pal[c], hot = c === activeCat
        let px = 0, py = 0
        for (let i = 0; i <= 90; i++) {
          project(s, k, R, (i / 90) * 6.283, tmp)
          if (i) {
            const df = clamp((tmp.sc - 0.62) / 0.7, 0.15, 1)
            ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(0.1 + 0.22 * df) * a * (hot ? 1.8 : 1)})`
            ctx.lineWidth = hot ? 1.4 : 1
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tmp.x, tmp.y); ctx.stroke()
          }
          px = tmp.x; py = tmp.y
        }
      })

      // items (core + planets), far → near
      const items = [{ core: true, z: 0 }]
      for (const n of NODES) {
        project(s, n.k, s.cr[n.k] * ap, n.phase + s.t * 0.35 / (1 + n.k * 0.35), tmp)
        const na = s.ca[n.k] * clamp((ap - 0.15 - n.i * 0.012) / 0.4, 0, 1)
        const act = n.id === activeId
        const r = (4 + n.level * 0.085) * tmp.sc * Math.pow(s.zoom, 0.5) * Math.max(0.75, s.U) * (act ? 1.25 : 1)
        items.push({ n, x: tmp.x, y: tmp.y, z: tmp.z, sc: tmp.sc, a: na, r, act })
      }
      items.sort((p, q) => q.z - p.z)
      s.items = items

      // hover hit-test
      if (!s.dragging) s.hover = s.mouse ? (() => { for (let i = items.length - 1; i >= 0; i--) { const it = items[i]; if (it.n && it.a > 0.35 && Math.hypot(s.mouse.x - it.x, s.mouse.y - it.y) <= it.r + 9) return it.n.id } return null })() : null
      cv.style.cursor = s.dragging ? 'grabbing' : s.hover ? 'pointer' : 'grab'

      const gold = dark ? [212, 175, 55] : [184, 146, 31]
      for (const it of items) {
        if (it.core) {
          const cs = Math.max(0.8, s.U), pulse = 1 + 0.05 * Math.sin(s.t * 2.2)
          const g = ctx.createRadialGradient(W / 2, H / 2 + 6, 0, W / 2, H / 2 + 6, 80 * cs * pulse * ap)
          g.addColorStop(0, `rgba(${gold},${0.5 * ap})`); g.addColorStop(1, `rgba(${gold},0)`)
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H / 2 + 6, 80 * cs * pulse * ap, 0, 6.283); ctx.fill()
          const d = ctx.createRadialGradient(W / 2 - 4, H / 2 + 2, 1, W / 2, H / 2 + 6, 16 * cs * ap)
          d.addColorStop(0, '#F0D060'); d.addColorStop(1, `rgb(${gold})`)
          ctx.fillStyle = d; ctx.beginPath(); ctx.arc(W / 2, H / 2 + 6, 16 * cs * ap, 0, 6.283); ctx.fill()
          ctx.font = `600 10px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = txt(0.75 * ap)
          ctx.fillText('ADITYA', W / 2, H / 2 + 6 + 32 * cs); ctx.textAlign = 'left'
          continue
        }
        const { n, x, y, r, a } = it; if (a < 0.02) continue
        const col = pal[n.category], df = clamp((it.sc - 0.65) / 0.6, 0.2, 1)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3)
        g.addColorStop(0, `rgba(${col},${0.35 * a * df})`); g.addColorStop(1, `rgba(${col},0)`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, 6.283); ctx.fill()
        const sp = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r)
        sp.addColorStop(0, `rgba(${Math.min(255, col[0] + 70)},${Math.min(255, col[1] + 70)},${Math.min(255, col[2] + 70)},${a})`); sp.addColorStop(1, `rgba(${col},${a * (0.55 + 0.45 * df)})`)
        ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill()
        ctx.strokeStyle = `rgba(${col},${0.6 * a * df})`; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(x, y, r + 4, -Math.PI / 2, -Math.PI / 2 + (n.level / 100) * 6.283); ctx.stroke()
      }

      // labels: near-first claims space, overlapping labels are hidden (shown on hover)
      const claimed = [], draw = []
      for (const it of items) if (it.n && it.a > 0.5) claimed.push({ x: it.x - it.r - 4, y: it.y - it.r - 4, w: (it.r + 4) * 2, h: (it.r + 4) * 2, id: it.n.id })
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i]; if (!it.n || it.a < 0.5) continue
        ctx.font = `${it.act ? 600 : 500} ${Math.round(11.5 * clamp(it.sc, 0.8, 1.2))}px ${FONT}`
        const w = ctx.measureText(it.n.name).width
        let lx2 = it.x + it.r + 9; if (lx2 + w > W - 6) lx2 = it.x - it.r - 9 - w
        const rect = { x: lx2 - 3, y: it.y - 9, w: w + 6, h: 18 }
        if (!it.act && claimed.some(c => c.id !== it.n.id && rect.x < c.x + c.w && rect.x + rect.w > c.x && rect.y < c.y + c.h && rect.y + rect.h > c.y)) continue
        claimed.push({ ...rect, id: it.n.id }); draw.push({ it, lx: lx2, font: ctx.font })
      }
      draw.reverse().forEach(({ it, lx: x, font }) => {
        const df = clamp((it.sc - 0.65) / 0.6, 0.25, 1)
        ctx.font = font; ctx.fillStyle = it.act ? `rgb(${pal[it.n.category]})` : txt(0.9 * it.a * df)
        ctx.fillText(it.n.name, x, it.y + 4)
      })

      // tooltip follow + sync
      const id = s.hover || s.pinned
      if (id !== s.tipId) { s.tipId = id; setTip(id ? BY_ID[id] : null) }
      const te = tipEl.current
      if (te) {
        const it = id && items.find(q => q.n && q.n.id === id)
        if (it) {
          const tx = clamp(it.x - 115, 6, W - 236)
          let ty = it.y - it.r - 122; if (ty < 8) ty = it.y + it.r + 18
          te.style.transform = `translate(${tx}px, ${Math.min(ty, H - 124)}px)`
        }
      }
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up)
      cv.removeEventListener('pointerleave', leave); cv.removeEventListener('wheel', wheel)
    }
  }, [])

  const key = e => {
    const s = S.current
    if (e.key === 'ArrowLeft') s.vyaw -= 0.012; else if (e.key === 'ArrowRight') s.vyaw += 0.012
    else if (e.key === 'ArrowUp') s.vpitch -= 0.008; else if (e.key === 'ArrowDown') s.vpitch += 0.008
    else if (e.key === '+' || e.key === '=') s.zoomT = clamp(s.zoomT * 1.15, 0.6, 2.2)
    else if (e.key === '-') s.zoomT = clamp(s.zoomT / 1.15, 0.6, 2.2)
    else if (e.key === 'Escape') { s.pinned = null; setPin(false) }
  }
  const zoomBy = f => { const s = S.current; s.zoomT = clamp(s.zoomT * f, 0.6, 2.2) }
  const reset = () => { const s = S.current; s.zoomT = 1; s.pitch = 1.05; s.vyaw = 0; s.vpitch = 0; s.pinned = null; setPin(false); setFilter(null) }
  const pal = PAL[theme]
  const shown = filter ? NODES.filter(n => n.category === filter).length : NODES.length
  const ctrlBtn = 'w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-300 hover:scale-110'

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[null, ...CATS].map(c => {
          const on = filter === c
          return (
            <button key={c || 'all'} onClick={() => setFilter(c)} className="relative px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2 transition-colors duration-300"
              style={{ border: '1px solid var(--border)', color: on ? 'var(--c1)' : 'var(--c4)' }}>
              {on && <motion.span layoutId="uni-chip" className="absolute inset-0 rounded-full" style={{ background: 'rgba(var(--gold-rgb),0.16)', border: '1px solid rgba(var(--gold-rgb),0.55)' }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative flex items-center gap-2">
                {c && <span className="w-2 h-2 rounded-full" style={{ background: `rgb(${pal[c]})` }} />}
                {c || 'All'}
              </span>
            </button>
          )
        })}
      </div>

      <div ref={wrap} className="relative rounded-2xl overflow-hidden select-none" style={{ border: '1px solid var(--border)', background: 'var(--hero-bg)' }}>
        <canvas ref={canvas} tabIndex={0} onKeyDown={key} role="img" aria-label="Interactive 3D map of my skills grouped into orbits by category. Drag to rotate, use plus and minus to zoom."
          className="block w-full outline-none" style={{ touchAction: 'pan-y' }} />
        <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase pointer-events-none" style={{ color: 'var(--c4)' }}>
          {shown} skills · {filter || `${CATS.length} orbits`}
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {[['+', () => zoomBy(1.2), 'Zoom in'], ['−', () => zoomBy(1 / 1.2), 'Zoom out'], ['⟲', reset, 'Reset view']].map(([l, f, label]) => (
            <button key={l} onClick={f} aria-label={label} title={label} className={ctrlBtn} style={{ border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--c1)' }}>{l}</button>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-wide pointer-events-none hidden sm:block" style={{ color: 'var(--c6)' }}>
          Drag to rotate · Ctrl/⌘ + scroll to zoom · Click a skill to pin
        </div>
        <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-wide pointer-events-none sm:hidden" style={{ color: 'var(--c6)' }}>Drag to rotate · tap a skill</div>

        <div ref={tipEl} className="absolute left-0 top-0 pointer-events-none z-10" style={{ width: 230, transform: 'translate(-999px,0)', willChange: 'transform' }}>
          <AnimatePresence mode="wait">
            {tip && (
              <motion.div key={tip.id} initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.22 }}
                className="rounded-xl p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
                <div className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--c4)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: `rgb(${pal[tip.category]})` }} />{tip.category}
                </div>
                <div className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--c1)' }}>{tip.name}</div>
                <div className="h-[3px] rounded-full overflow-hidden mb-2" style={{ background: 'var(--elevated)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: `rgb(${pal[tip.category]})` }} initial={{ width: 0 }} animate={{ width: `${tip.level}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
                </div>
                <div className="flex justify-between gap-3 whitespace-nowrap font-mono text-[10px]" style={{ color: 'var(--c4)' }}><span>{tip.level}% · {levelLabel(tip.level)}</span><span>{pin ? 'pinned' : 'click to pin'}</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}