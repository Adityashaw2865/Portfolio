import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    let stored = null
    try { stored = localStorage.getItem('portfolio-theme') } catch (e) {}
    const initial = stored || 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = e => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => { setTheme(next); document.documentElement.setAttribute('data-theme', next) }
    try { localStorage.setItem('portfolio-theme', next) } catch (err) {}

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) { apply(); return }

    // Circular reveal growing from the toggle button
    const r = e.currentTarget.getBoundingClientRect()
    const root = document.documentElement
    root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`)
    root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`)
    root.classList.add('vt')
    const t = document.startViewTransition(() => flushSync(apply))
    t.finished.finally(() => root.classList.remove('vt'))
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 hover:scale-105"
      style={{ background: 'rgba(var(--c4-rgb),0.06)', border: '1px solid rgba(var(--c4-rgb),0.15)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--c1)" strokeWidth={1.6} style={{ width: 19, height: 19 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--c1)" strokeWidth={1.6} style={{ width: 19, height: 19 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        )}
      </motion.div>
    </button>
  )
}
