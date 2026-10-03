import { motion } from 'framer-motion'

const blobs = [
  { c: '--blob1-rgb', s: 540, left: '-10%', top: '5%', x: [0, 90, -40, 0], y: [0, 70, 120, 0], d: 28 },
  { c: '--blob2-rgb', s: 460, left: '68%', top: '25%', x: [0, -80, 40, 0], y: [0, 90, -30, 0], d: 32 },
  { c: '--blob3-rgb', s: 500, left: '15%', top: '62%', x: [0, 60, -70, 0], y: [0, -80, 40, 0], d: 36 },
  { c: '--blob1-rgb', s: 320, left: '78%', top: '70%', x: [0, -50, 30, 0], y: [0, 50, -60, 0], d: 30 },
]

export default function Background() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: b.s, height: b.s, left: b.left, top: b.top, background: `radial-gradient(circle, rgba(var(${b.c}),1) 0%, transparent 70%)`, opacity: 'var(--blob-o)', filter: 'blur(70px)' }}
          animate={{ x: b.x, y: b.y }} transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  )
}
