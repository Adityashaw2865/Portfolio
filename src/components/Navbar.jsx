import { RESUME_URL } from '../data/config'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = ['About', 'Skills', 'Experience', 'Projects', 'DSA', 'Certifications', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links.map(l => document.getElementById(l.toLowerCase())).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{ background: scrolled ? 'rgba(var(--bg-rgb),0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(var(--c4-rgb),0.08)' : '1px solid transparent' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-display text-lg font-semibold tracking-tight" style={{ color: 'var(--c1)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ color: 'var(--gold-text)' }}>A</span>ditya<span style={{ color: 'var(--gold-text)' }}>.</span>
        </button>

        <ul className="hidden md:flex items-center gap-4 lg:gap-6">
          {links.map((link) => {
            const isActive = active === link.toLowerCase()
            return (
              <li key={link}>
                <button onClick={() => scrollTo(link)} className="relative text-sm tracking-wide transition-colors duration-200 pb-1" style={{ background: 'none', border: 'none', cursor: 'pointer', color: isActive ? 'var(--c1)' : 'var(--c5)' }}
                  onMouseEnter={e => { if (!isActive) e.target.style.color = 'var(--c2)' }}
                  onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--c5)' }}>
                  {link}
                  {isActive && (
                    <motion.span layoutId="nav-underline" className="absolute left-0 right-0 -bottom-0.5 h-[1.5px]" style={{ background: 'var(--grad)' }} />
                  )}
                </button>
              </li>
            )
          })}
          <li>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="text-sm px-4 py-2 rounded-lg transition-all duration-200 font-mono"
              style={{ border: '1px solid rgba(var(--c1-rgb),0.2)', color: 'var(--c1)', background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Resume
            </a>
          </li>
        </ul>

        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="block w-5 h-0.5 transition-all duration-300" style={{ background: 'var(--c4)', transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
          <span className="block w-5 h-0.5 transition-all duration-300" style={{ background: 'var(--c4)', opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 transition-all duration-300" style={{ background: 'var(--c4)', transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(var(--bg2-rgb),0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(var(--c4-rgb),0.08)' }}>
            <ul className="flex flex-col py-4 px-6 gap-4">
              {links.map((link) => (
                <li key={link}>
                  <button onClick={() => scrollTo(link)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c3)', fontSize: 14 }}>{link}</button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
