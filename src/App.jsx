import { MotionConfig } from 'framer-motion'
import Background from './components/Background'
import CursorGlow from './components/CursorGlow'
import ScrollProgress from './components/ScrollProgress'
import Stats from './components/Stats'
import Marquee from './components/Marquee'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Hackathons from './components/Hackathons'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import DSA from './components/DSA'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'
import CommandPalette from './components/CommandPalette'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--c2)', transition: 'background 0.4s ease, color 0.4s ease' }}>
      <Background />
      <CursorGlow />
      <ScrollProgress />
      <Loader />
      <ThemeToggle />
      <CommandPalette />
      <Navbar />
      <Hero />
      <Stats />
      <Marquee />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Hackathons />
      <DSA />
      <Certifications />
      <Contact />
      <Footer />
    </div>
    </MotionConfig>
  )
}
