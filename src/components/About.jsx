import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const C = { text: 'var(--c1)', muted: 'var(--c2)', dim: 'var(--c3)', faint: 'var(--c4)' }

const fadeUp = { hidden: { opacity: 0, y: 40, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }

const stats = [
  { value: '3rd Year', label: 'Undergraduate' },
  { value: 'IT', label: 'Branch' },
  { value: 'C++', label: 'Primary Language' },
  { value: 'JGEC', label: 'College' },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="py-28 px-6 relative">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.p variants={fadeUp} className="text-xs tracking-[0.25em] uppercase font-mono mb-4" style={{ color: 'var(--saffron-text)' }}>01 / About</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold h2-grad mb-12" style={{ color: C.text }}>Who I Am</motion.h2>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div variants={stagger}>
              <motion.p variants={fadeUp} className="leading-relaxed text-lg mb-5" style={{ color: C.faint }}>
                I'm <span style={{ color: C.muted, fontWeight: 600 }}>Aditya Kumar Shaw</span>, a 3rd year Information Technology student at{' '}
                <span style={{ color: C.muted, fontWeight: 600 }}>Jalpaiguri Government Engineering College</span>. Passionate about building web experiences and solving algorithmic challenges.
              </motion.p>
              <motion.p variants={fadeUp} className="leading-relaxed mb-8" style={{ color: C.faint, fontSize: 15 }}>
                My journey spans full-stack apps with React & Node.js to competitive programming in C++. I've completed an <span style={{ color: C.dim }}>ML research internship at NIT Jamshedpur</span> (fake news detection with BERT) and an <span style={{ color: C.dim }}>RPA Bootcamp at C-DAC Kolkata</span>, plus a certification from <span style={{ color: C.dim }}>ISRO's IIRS</span>.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {['Problem Solving', 'Full-Stack Dev', 'DSA', 'Machine Learning', 'Open Source', 'ISRO Certified'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-lg font-mono" style={{ background: 'rgba(var(--c1-rgb),0.04)', border: '1px solid rgba(var(--c1-rgb),0.09)', color: C.faint }}>
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label }) => (
                <motion.div key={label} variants={fadeUp} className="p-5 rounded-xl transition-all duration-300 group"
                  style={{ border: '1px solid rgba(var(--c4-rgb),0.1)', background: 'rgba(var(--c4-rgb),0.02)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.18)'; e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--c4-rgb),0.1)'; e.currentTarget.style.background = 'rgba(var(--c4-rgb),0.02)'; }}>
                  <p className="font-display text-2xl font-bold mb-1" style={{ color: C.text }}>{value}</p>
                  <p className="text-sm" style={{ color: 'var(--c7)' }}>{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
