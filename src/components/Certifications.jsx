import { motion } from 'framer-motion'
import Section, { fadeUp, stagger, cardStyle, accentFor } from './Section'

const certs = [
  { icon: '🛰️', title: 'ISRO / IIRS Certification', org: 'Indian Institute of Remote Sensing, ISRO', href: 'https://isrolms.iirs.gov.in/mod/customcert/my_certificates.php?userid=414294&certificateid=136&downloadcert=1' },
  { icon: '🎓', title: 'Internship Certificate', org: 'NIT Jamshedpur', href: 'https://drive.google.com/file/d/1I2ADUzSTtPNdfkW8yBr5UnqmpOLlGIPg/view?usp=sharing' },
  { icon: '💻', title: 'Web Development', org: 'Elevance Skills', href: 'https://www.elevanceskills.com/certificates/6a44bc41e3163d3253fc9ea1' },
]

export default function Certifications() {
  return (
    <Section id="certifications" num="07" kicker="Certifications" title="Certificates">
      <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-5">
        {certs.map(({ icon, title, org, href }) => (
          <motion.a key={title} variants={fadeUp} href={href} target="_blank" rel="noreferrer" className="p-6 rounded-2xl block transition-all duration-300 hover:-translate-y-1" style={cardStyle}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <h3 className="font-display text-base font-semibold mt-4 mb-1" style={{ color: 'var(--c2)' }}>{title}</h3>
            <p className="font-mono text-xs mb-4" style={{ color: 'var(--c7)' }}>{org}</p>
            <span className="text-xs" style={{ color: 'var(--c1)' }}>View certificate ↗</span>
          </motion.a>
        ))}
      </motion.div>
    </Section>
  )
}
