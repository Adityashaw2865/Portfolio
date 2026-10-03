import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const fadeUp = { hidden: { opacity: 0, y: 40, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }
export const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
export const cardStyle = { border: '1px solid var(--border)', background: 'var(--surface)' }

export const accentFor = () => 'var(--gold)'
export const tagStyleFor = () => ({ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--tag-border)', color: 'var(--tag-text)', background: 'var(--tag-bg)' })

export default function Section({ id, num, kicker, title, intro, alt, children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const acc = 'var(--saffron-text)'
  return (
    <section id={id} className="py-28 px-6 relative" style={alt ? { background: 'var(--bg-alt)' } : undefined}>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.p variants={fadeUp} className="text-xs tracking-[0.25em] uppercase font-mono mb-4" style={{ color: acc }}>{num} / {kicker}</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold h2-grad mb-4 h2-grad">{title}</motion.h2>
          <motion.div variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }} className="h-[3px] w-20 rounded-full mb-5 origin-left" style={{ background: 'var(--gold)' }} />
          {intro && <motion.p variants={fadeUp} className="max-w-xl leading-relaxed" style={{ color: 'var(--c4)', fontSize: 15 }}>{intro}</motion.p>}
          <div className="mt-10">{children}</div>
        </motion.div>
      </div>
    </section>
  )
}
