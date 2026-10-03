import { RESUME_URL, GITHUB_URL, LINKEDIN_URL, LEETCODE_URL, EMAIL } from '../data/config'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = { text: 'var(--c1)', muted: 'var(--c2)', dim: 'var(--c3)', faint: 'var(--c4)' }

const commands = [
  { label: 'About', hint: 'Who I am', action: (nav) => nav('about') },
  { label: 'Skills', hint: 'Technical stack', action: (nav) => nav('skills') },
  { label: 'Experience', hint: 'Internships & bootcamps', action: (nav) => nav('experience') },
  { label: 'Projects', hint: 'Featured work', action: (nav) => nav('projects') },
  { label: 'DSA', hint: 'Algorithmic thinking', action: (nav) => nav('dsa') },
  { label: 'Contact', hint: "Let's connect", action: (nav) => nav('contact') },
  { label: 'Hackathons', hint: 'Smart India Hackathon', action: (nav) => nav('hackathons') },
  { label: 'Certifications', hint: 'Certificates', action: (nav) => nav('certifications') },
  { label: 'Resume', hint: 'Download CV (PDF)', action: () => window.open(RESUME_URL, '_blank') },
  { label: 'GitHub', hint: 'github.com/Adityashaw2865', action: () => window.open(GITHUB_URL, '_blank') },
  { label: 'LinkedIn', hint: 'Connect on LinkedIn', action: () => window.open(LINKEDIN_URL, '_blank') },
  { label: 'Email', hint: EMAIL, action: () => window.open(`mailto:${EMAIL}`, '_blank') },
  { label: 'LeetCode', hint: '400+ problems solved', action: () => window.open(LEETCODE_URL, '_blank') },
  { label: 'Back to Top', hint: 'Scroll to hero', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) || c.hint.toLowerCase().includes(query.toLowerCase())
  )

  const navigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const run = (cmd) => {
    cmd.action(navigate)
    setOpen(false)
    setQuery('')
    setSelected(0)
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else { setQuery(''); setSelected(0) }
  }, [open])

  useEffect(() => setSelected(0), [query])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[selected]) run(filtered[selected]) }
  }

  return (
    <>
      {/* Trigger hint, bottom-right */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs transition-all duration-200 hover:scale-[1.03]"
        style={{ background: 'rgba(var(--c4-rgb),0.05)', border: '1px solid rgba(var(--c4-rgb),0.12)', color: C.faint, backdropFilter: 'blur(10px)' }}
      >
        <span>Search</span>
        <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(var(--c1-rgb),0.08)', color: C.text, fontSize: 10 }}>Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh] px-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg2)', border: '1px solid rgba(var(--c1-rgb),0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(var(--c4-rgb),0.08)' }}>
                <span style={{ color: C.faint }}>⌘</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search projects, skills, contact..."
                  className="flex-1 bg-transparent outline-none text-sm font-mono"
                  style={{ color: C.text }}
                />
                <kbd className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(var(--c4-rgb),0.08)', color: C.faint, fontSize: 10 }}>Esc</kbd>
              </div>

              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.length === 0 && (
                  <p className="text-center py-8 text-sm font-mono" style={{ color: 'var(--c7)' }}>No results found</p>
                )}
                {filtered.map((cmd, i) => (
                  <button
                    key={cmd.label}
                    onClick={() => run(cmd)}
                    onMouseEnter={() => setSelected(i)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors duration-100"
                    style={{ background: selected === i ? 'rgba(var(--c1-rgb),0.06)' : 'transparent' }}
                  >
                    <span className="text-sm" style={{ color: selected === i ? C.text : C.dim }}>{cmd.label}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--c7)' }}>{cmd.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
