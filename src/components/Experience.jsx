import { motion } from 'framer-motion'
import Section, { fadeUp, stagger, cardStyle, tagStyleFor, accentFor } from './Section'

const items = [
  { role: 'Machine Learning Research Intern', org: 'NIT Jamshedpur', desc: 'Research on fake news detection: compared classical ML models (LR, SVM, XGBoost) with fine-tuned BERT on the WELFake dataset of 72k articles, reaching ~99.2% accuracy.', tags: ['Python', 'BERT', 'PyTorch', 'XGBoost'] },
  { role: 'RPA Bootcamp', org: 'C-DAC Kolkata', desc: 'Hands-on bootcamp in Robotic Process Automation (RPA).', tags: ['RPA'] },
]

export default function Experience() {
  return (
    <Section id="experience" num="03" kicker="Experience" title="Internships & Training">
      <motion.div variants={stagger} className="grid gap-5">
        {items.map(({ role, org, desc, tags }) => (
          <motion.div key={role} variants={fadeUp} className="p-7 rounded-2xl" style={cardStyle}>
            <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--c2)' }}>{role}</h3>
            <p className="font-mono text-xs mt-1 mb-4" style={{ color: 'var(--c4)' }}>{org}</p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--c10)' }}>{desc}</p>
            <div className="flex flex-wrap gap-1.5">{tags.map(t => <span key={t} className="font-mono" style={tagStyleFor(t)}>{t}</span>)}</div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
