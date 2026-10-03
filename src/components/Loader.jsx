import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold tracking-tight"
            style={{ color: 'var(--c1)' }}
          >
            Aditya<span style={{ color: 'var(--gold-text)' }}>.</span>
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] mt-5 rounded-full overflow-hidden"
            style={{ background: 'rgba(var(--c1-rgb),0.08)' }}
          >
            <motion.div
              initial={{ x: -120 }}
              animate={{ x: 120 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
              style={{ background: 'linear-gradient(90deg, transparent, var(--a2), transparent)' }}
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="font-mono text-xs tracking-widest uppercase mt-4"
            style={{ color: 'var(--c7)' }}
          >
            Loading...
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
