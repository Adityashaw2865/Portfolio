import { GITHUB_URL, LEETCODE_URL } from '../data/config'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import StockGraph from './StockGraph'
import LeetCodeGraph from './LeetCodeGraph'
import GitHubActivity from './GitHubActivity'

const fadeUp = { hidden: { opacity: 0, y: 30, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const dsaStats = [
  { value: '400+', label: 'LeetCode Solved', sub: 'Regular problem solving' },
  { value: '400+', label: 'CodeChef Solved', sub: 'Competitive programming' },
  { value: 'C++', label: 'Primary Language', sub: 'STL & competitive use' },
  { value: 'Daily', label: 'Practice Cadence', sub: 'Consistent grind' },
]

const topics = ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching', 'Recursion & Backtracking', 'Stack & Queue', 'Hashing', 'Binary Search', 'Greedy Algorithms', 'Two Pointers', 'Sliding Window']

const platforms = [
  { name: 'LeetCode', sub: '400+ problems', href: LEETCODE_URL },
  { name: 'GeeksForGeeks', sub: 'Practice & articles', href: 'https://www.geeksforgeeks.org/profile/adityaxshaw' },
  { name: 'Codeforces', sub: 'Competitive rounds', href: 'https://codeforces.com/profile/Aditya_Xshaw' },
  { name: 'CodeChef', sub: '400+ solved', href: 'https://www.codechef.com/users/aditya_shaw09' },
  { name: 'GitHub — Solutions', sub: 'LeetCode code repo', href: 'https://github.com/Adityashaw2865/Leetcode_Prectise' },
]

export default function DSA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="dsa" style={{ background: 'var(--bg-alt)' }} className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(var(--c1-rgb),0.02) 0%,transparent 70%)', filter: 'blur(80px)' }} />
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--saffron-text)' }}>06 / DSA</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold h2-grad mb-4" style={{ color: 'var(--c1)' }}>Algorithmic Thinking</motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl leading-relaxed mb-14" style={{ color: 'var(--c4)', fontSize: 15 }}>
            Data Structures & Algorithms form the backbone of my problem-solving approach. I practice regularly across multiple platforms to sharpen logic and prepare for top engineering roles.
          </motion.p>

          {/* Stats */}
          <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {dsaStats.map(({ value, label, sub }) => (
              <motion.div key={label} variants={fadeUp} className="p-6 rounded-2xl text-center transition-all duration-300"
                style={{ border: '1px solid rgba(var(--c4-rgb),0.08)', background: 'rgba(var(--c4-rgb),0.02)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.16)'; e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--c4-rgb),0.08)'; e.currentTarget.style.background = 'rgba(var(--c4-rgb),0.02)'; }}>
                <p className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--c1)' }}>{value}</p>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--c3)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'var(--c9)' }}>{sub}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Topics */}
            <motion.div variants={fadeUp} className="p-7 rounded-2xl" style={{ border: '1px solid rgba(var(--c4-rgb),0.08)', background: 'rgba(var(--c4-rgb),0.02)' }}>
              <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--c6)' }}>Topics Covered</p>
              <div className="flex flex-wrap gap-2">
                {topics.map(t => (
                  <span key={t} className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-default"
                    style={{ background: 'rgba(var(--c1-rgb),0.03)', border: '1px solid rgba(var(--c1-rgb),0.07)', color: 'var(--c5)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--c3)'; e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--c5)'; e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.07)'; }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Platforms */}
            <motion.div variants={fadeUp} className="p-7 rounded-2xl" style={{ border: '1px solid rgba(var(--c4-rgb),0.08)', background: 'rgba(var(--c4-rgb),0.02)' }}>
              <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--c6)' }}>Platforms</p>
              <div className="flex flex-col gap-3">
                {platforms.map(({ name, sub, href }) => (
                  <a key={name} href={href} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                    style={{ border: '1px solid rgba(var(--c1-rgb),0.07)', background: 'rgba(var(--c1-rgb),0.02)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.18)'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.07)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.02)'; }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--c2)' }}>{name}</p>
                      <p className="font-mono text-xs" style={{ color: 'var(--c6)' }}>{sub}</p>
                    </div>
                    <span className="ml-auto text-xs" style={{ color: 'var(--c9)' }}>↗</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stock-style progress graph (live GitHub contributions) */}
          <motion.div variants={fadeUp} className="mt-8">
            <StockGraph />
          </motion.div>

          {/* LeetCode submission heatmap (live) */}
          <motion.div variants={fadeUp} className="mt-8">
            <LeetCodeGraph />
          </motion.div>

          {/* GitHub stats, languages and contribution heatmap (native, live) */}
          <motion.div variants={fadeUp} className="mt-8">
            <GitHubActivity />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}