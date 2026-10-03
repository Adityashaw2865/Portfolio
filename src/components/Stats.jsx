import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate } from 'framer-motion'

const stats = [
  { to: 400, suffix: '+', label: 'LeetCode Problems' },
  { to: 99.2, suffix: '%', dec: 1, label: 'BERT Accuracy' },
  { to: 8, suffix: '', label: 'Projects Built' },
  { to: 2, suffix: '', label: 'SIH 2026 Projects' },
]

function Count({ to, suffix, dec = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{v.toFixed(dec)}{suffix}</span>
}

export default function Stats() {
  return (
    <section className="px-6 py-14" style={{ background: 'var(--bg-alt)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ label, ...s }) => (
          <div key={label} className="text-center md:text-left">
            <div className="font-display text-4xl md:text-5xl font-bold tabular-nums" style={{ color: 'var(--c1)' }}><Count {...s} /></div>
            <div className="h-[2px] w-8 rounded-full my-3 mx-auto md:mx-0" style={{ background: 'var(--gold)' }} />
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: 'var(--c4)' }}>{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
