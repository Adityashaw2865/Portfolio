import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CursorGlow() {
  const x = useMotionValue(-600), y = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 120, damping: 20 }), sy = useSpring(y, { stiffness: 120, damping: 20 })
  useEffect(() => {
    const m = e => { x.set(e.clientX - 250); y.set(e.clientY - 250) }
    window.addEventListener('mousemove', m)
    return () => window.removeEventListener('mousemove', m)
  }, [x, y])
  return <motion.div aria-hidden className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[1] hidden md:block"
    style={{ x: sx, y: sy, background: 'radial-gradient(circle, rgba(var(--gold-rgb),0.07), transparent 65%)' }} />
}
