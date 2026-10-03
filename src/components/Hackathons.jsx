import { motion } from 'framer-motion'
import Section, { fadeUp, stagger, cardStyle, tagStyleFor, accentFor } from './Section'

const items = [
  {
    title: 'MediKiosk — Hospital OPD Self-Service Kiosk',
    meta: 'Problem Statement 26047 · Team Code Tantra',
    points: ['Role-based patient → triage → doctor flow', 'Bhashini ASR voice input in 8 languages', 'OCR document pipeline', 'Gemini-based clinical narrative generation', 'FHIR bundle export'],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'FHIR'],
    github: 'https://github.com/Adityashaw2865/SIH',
    demo: 'https://sih-psi-virid.vercel.app/#/home',
  },
  {
    title: 'VyaparSetu — Single-Window Business Approvals',
    meta: 'Problem Statement SIH26130 · Maharashtra Single Window System',
    points: ['One dashboard to apply for every government approval and licence', 'Auto-computed required approvals + real-time status tracking', 'Four roles: Applicant, Officer, Inspector, Admin', 'Server-side rules & risk engine with JWT auth', 'Document uploads, fee payment and grievances', 'Docker Compose setup + GitHub Actions CI'],
    tags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Gemini API', 'Docker'],
    github: 'https://github.com/Adityashaw2865/code-Tantraa',
    demo: 'https://code-tantraa.vercel.app/',
  },
]

export default function Hackathons() {
  return (
    <Section id="hackathons" num="05" kicker="Hackathons" title="Smart India Hackathon 2026">
      <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
        {items.map(({ title, meta, points, tags, github, demo }) => (
          <motion.div key={title} variants={fadeUp} className="p-7 rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1" style={cardStyle}>
            <p className="font-mono text-xs mb-1" style={{ color: 'var(--c4)' }}>{meta}</p>
            <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--c2)' }}>{title}</h3>
            <ul className="grid gap-2 mb-6 flex-1">
              {points.map(p => <li key={p} className="text-sm flex gap-2" style={{ color: 'var(--c10)' }}><span style={{ color: accentFor(title) }}>✓</span>{p}</li>)}
            </ul>
            <div className="flex flex-wrap gap-1.5 mb-6">{tags.map(t => <span key={t} className="font-mono" style={tagStyleFor(t)}>{t}</span>)}</div>
            <div className="flex gap-2">
              <a href={github} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs py-2 rounded-lg" style={{ border: '1px solid rgba(var(--c1-rgb),0.18)', color: 'var(--c1)' }}>GitHub ↗</a>
              <a href={demo} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs py-2 rounded-lg" style={{ border: '1px solid rgba(var(--ov-rgb),0.1)', color: 'var(--c3)' }}>Live Demo ↗</a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
