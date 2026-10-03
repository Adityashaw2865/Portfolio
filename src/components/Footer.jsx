import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="py-10 px-6" style={{ borderTop: '1px solid rgba(var(--c4-rgb),0.06)' }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ color: 'var(--c8)' }}>
        <p className="font-display tracking-tight text-sm" style={{ color: 'var(--c8)' }}>
          <span style={{ color: 'rgba(var(--c1-rgb),0.3)' }}>A</span>ditya Kumar Shaw<span style={{ color: 'rgba(var(--c1-rgb),0.3)' }}>.</span>
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--c8)' }}>Built with React · Tailwind · Framer Motion</p>
        <p className="font-mono text-xs" style={{ color: 'var(--c8)' }}>© {new Date().getFullYear()}</p>
      </div>
    </motion.footer>
  )
}
