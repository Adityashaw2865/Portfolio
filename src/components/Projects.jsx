import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section, { fadeUp, stagger, cardStyle, tagStyleFor, accentFor } from './Section'
import { projects } from '../data/projects'

const linkBtn = { border: '1px solid rgba(var(--c1-rgb),0.18)', color: 'var(--c1)' }

function Links({ p }) {
  if (!p.github && !p.demo) return <span className="flex-1 text-center text-xs py-2 rounded-lg font-mono" style={{ border: '1px dashed rgba(var(--ov-rgb),0.15)', color: 'var(--c7)' }}>Coming Soon</span>
  return (<>
    {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs py-2 rounded-lg" style={linkBtn}>GitHub ↗</a>}
    {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs py-2 rounded-lg" style={{ border: '1px solid rgba(var(--ov-rgb),0.1)', color: 'var(--c3)' }}>Live Demo ↗</a>}
  </>)
}

function Card({ p, onOpen, span }) {
  return (
    <motion.div variants={fadeUp} className={`p-7 rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 ${span || ''}`} style={cardStyle}>
      <div className="flex items-center justify-between mb-5">
        <div className="h-1 w-10 rounded-full" style={{ background: 'var(--gold)' }} />
        {p.featured && <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded" style={{ background: 'var(--maroon)', color: 'var(--on-maroon)' }}>Featured</span>}
      </div>
      <h3 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--c2)' }}>{p.title}</h3>
      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--c10)' }}>{p.desc}</p>
      <p className="text-xs font-mono mb-5 flex-1" style={{ color: 'var(--gold-text)' }}>✓ {p.highlight}</p>
      <div className="flex flex-wrap gap-1.5 mb-5">{p.tags.slice(0, 4).map(t => <span key={t} className="font-mono" style={tagStyleFor(t)}>{t}</span>)}</div>
      <button onClick={() => onOpen(p)} className="text-xs py-2 rounded-lg mb-2" style={{ border: '1px solid rgba(var(--ov-rgb),0.1)', color: 'var(--c3)' }}>View Details</button>
      <div className="flex gap-2"><Links p={p} /></div>
    </motion.div>
  )
}

function Modal({ p, onClose }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[95] flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} onClick={e => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-8 rounded-2xl" style={{ background: 'var(--bg2)', border: '1px solid rgba(var(--c1-rgb),0.14)' }}>
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--c1)' }}>{p.title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--c5)' }}>✕</button>
        </div>
        <p className="text-base font-medium leading-relaxed mb-4" style={{ color: 'var(--c1)' }}>{p.summary}</p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--c10)' }}>{p.desc}</p>
        <p className="text-xs font-mono mb-5" style={{ color: 'var(--gold-text)' }}>✓ {p.highlight}</p>
        <div className="flex flex-wrap gap-1.5 mb-6">{p.tags.map(t => <span key={t} className="font-mono" style={tagStyleFor(t)}>{t}</span>)}</div>
        <div className="flex gap-2"><Links p={p} /></div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [open, setOpen] = useState(null)
  const featured = projects.filter(p => p.featured), more = projects.filter(p => !p.featured)
  return (
    <Section id="projects" num="04" kicker="Projects" title="Featured Projects" alt>
      <motion.div variants={stagger} className="grid md:grid-cols-6 gap-5">
        {featured.map((p, i) => <Card key={p.title} p={p} onOpen={setOpen} span={i < 3 ? 'md:col-span-2' : 'md:col-span-3'} />)}
      </motion.div>
      <motion.p variants={fadeUp} className="font-mono text-xs tracking-widest uppercase mt-14 mb-6" style={{ color: 'var(--c6)' }}>More Projects</motion.p>
      <motion.div variants={stagger} style={{ borderTop: '1px solid var(--border)' }}>
        {more.map((p, i) => (
          <motion.button key={p.title} variants={fadeUp} onClick={() => setOpen(p)}
            className="group w-full flex items-center gap-5 py-6 text-left transition-all duration-300 hover:pl-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-mono text-sm w-8 shrink-0" style={{ color: 'var(--c8)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="flex-1 font-display text-xl md:text-2xl font-semibold transition-colors duration-300 group-hover:text-[color:var(--gold-text)]" style={{ color: 'var(--c1)' }}>{p.title}</span>
            <span className="hidden md:block font-mono text-xs" style={{ color: 'var(--c4)' }}>{p.tags.slice(0, 3).join(' · ')}</span>
            <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-300 group-hover:rotate-45" style={{ border: '1px solid var(--border)', color: 'var(--gold-text)' }}>↗</span>
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence>{open && <Modal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Section>
  )
}
