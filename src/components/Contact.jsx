import { RESUME_URL, GITHUB_URL, LINKEDIN_URL, LEETCODE_URL, EMAIL } from '../data/config'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { SiGithub, SiGmail, SiLeetcode } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'

const C = { text: 'var(--c1)', muted: 'var(--c2)', dim: 'var(--c3)', faint: 'var(--c4)' }

const fadeUp = { hidden: { opacity: 0, y: 30, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const socials = [
  { icon: SiGithub, label: 'GitHub', sub: 'github.com/Adityashaw2865', href: GITHUB_URL },
  { icon: FaLinkedin, label: 'LinkedIn', sub: 'Connect with me', href: LINKEDIN_URL },
  { icon: SiGmail, label: 'Email', sub: EMAIL, href: `mailto:${EMAIL}` },
  { icon: SiLeetcode, label: 'LeetCode', sub: '400+ problems solved', href: LEETCODE_URL },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [f, setF] = useState({ name: '', email: '', message: '' })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const send = e => {
    e.preventDefault()
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + f.name)}&body=${encodeURIComponent(f.message + '\n\n— ' + f.name + ' (' + f.email + ')')}`
  }
  const field = { border: '1px solid rgba(var(--c4-rgb),0.15)', background: 'transparent', color: 'var(--c1)' }

  return (
    <section id="contact" style={{ background: 'var(--bg-alt)' }} className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(var(--c1-rgb),0.03) 0%,transparent 70%)', filter: 'blur(80px)' }} />
      <div className="max-w-5xl mx-auto relative" ref={ref}>
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.p variants={fadeUp} className="text-xs tracking-[0.25em] uppercase font-mono mb-4" style={{ color: 'var(--saffron-text)' }}>08 / Contact</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold h2-grad mb-5" style={{ color: C.text }}>Let's Connect</motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl leading-relaxed mb-14" style={{ color: C.faint, fontSize: 15 }}>
            Open to internships, full-stack roles, and interesting collaborations. Reach out through any of these — I usually reply within a day.
          </motion.p>

          <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4 mb-10">
            {socials.map(({ icon: Icon, label, sub, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                variants={fadeUp}
                className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300"
                style={{ border: '1px solid rgba(var(--c4-rgb),0.1)', background: 'rgba(var(--c4-rgb),0.02)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.18)'; e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.04)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--c4-rgb),0.1)'; e.currentTarget.style.background = 'rgba(var(--c4-rgb),0.02)'; e.currentTarget.style.transform = 'none' }}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0" style={{ background: 'rgba(var(--c1-rgb),0.06)' }}>
                  <Icon style={{ fontSize: 20, color: 'var(--gold)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: C.muted }}>{label}</p>
                  <p className="font-mono text-xs truncate" style={{ color: 'var(--c7)' }}>{sub}</p>
                </div>
                <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--c9)' }}>↗</span>
              </motion.a>
            ))}
          </motion.div>

          <motion.form variants={fadeUp} onSubmit={send} className="grid gap-4 mb-10 p-6 rounded-2xl" style={{ border: '1px solid rgba(var(--c4-rgb),0.1)', background: 'rgba(var(--c4-rgb),0.02)' }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required value={f.name} onChange={set('name')} placeholder="Your name" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={field} />
              <input required type="email" value={f.email} onChange={set('email')} placeholder="Your email" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={field} />
            </div>
            <textarea required rows={4} value={f.message} onChange={set('message')} placeholder="Your message" className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={field} />
            <div className="flex items-center gap-4 flex-wrap">
              <button type="submit" className="px-7 py-3 rounded-xl font-semibold text-sm" style={{ background: 'var(--btn-grad)', color: 'var(--on-gold)' }}>Send Message ↗</button>
              <span className="font-mono text-xs" style={{ color: 'var(--c7)' }}>Opens your email app with the message ready to send.</span>
            </div>
          </motion.form>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a href={`mailto:${EMAIL}`} className="px-7 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95" style={{ background: 'var(--btn-grad)', color: 'var(--on-gold)' }}>
              Say Hello ↗
            </a>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="px-7 py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95" style={{ border: '1px solid rgba(var(--ov-rgb),0.08)', color: C.dim, background: 'rgba(var(--ov-rgb),0.02)' }}>
              Download CV ↓
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
