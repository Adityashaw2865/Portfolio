import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  SiJavascript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb,
  SiGit, SiReact, SiJsonwebtokens
} from 'react-icons/si'

const fadeUp = { hidden: { opacity: 0, y: 30, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const skillGroups = [
  { category: 'Languages', items: [{ name: 'C++', level: 85 }, { name: 'C', level: 75 }, { name: 'JavaScript', level: 80 }, { name: 'Python', level: 70 }] },
  { category: 'Frontend', items: [{ name: 'React.js', level: 82 }, { name: 'HTML5', level: 88 }, { name: 'CSS3', level: 82 }, { name: 'Tailwind CSS', level: 82 }] },
  { category: 'Backend', items: [{ name: 'Node.js', level: 72 }, { name: 'Express.js', level: 70 }, { name: 'JWT Auth', level: 65 }] },
  { category: 'Databases', items: [{ name: 'MongoDB', level: 68 }, { name: 'Mongoose', level: 65 }, { name: 'MySQL', level: 60 }] },
  { category: 'ML / AI', items: [{ name: 'BERT / Transformers', level: 65 }, { name: 'PyTorch', level: 55 }, { name: 'Scikit-learn', level: 60 }] },
  { category: 'Tools', items: [{ name: 'Git', level: 80 }, { name: 'GitHub', level: 82 }, { name: 'VS Code', level: 90 }, { name: 'UiPath (RPA)', level: 55 }] },
]

const iconStack = [
  { icon: SiJavascript, name: 'JavaScript' },
  { icon: SiTailwindcss, name: 'Tailwind' },
  { icon: SiNodedotjs, name: 'Node.js' },
  { icon: SiExpress, name: 'Express' },
  { icon: SiMongodb, name: 'MongoDB' },
  { icon: SiGit, name: 'Git' },
  { icon: SiReact, name: 'React' },
  { icon: SiJsonwebtokens, name: 'JWT' },
]

const ACC = { Languages: 'a1', Frontend: 'a1', Backend: 'a1', Databases: 'a1', 'ML / AI': 'a1', Tools: 'a1' }

function SkillBar({ name, level, ac }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span style={{ fontSize: 13, color: 'var(--c3)' }}>{name}</span>
        <span className="font-mono" style={{ fontSize: 10, color: 'var(--c6)' }}>{level}%</span>
      </div>
      <div style={{ height: 2, background: 'rgba(var(--c1-rgb),0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, rgba(var(--${ac}-rgb),0.35), var(--${ac}))` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="skills" style={{ background: 'var(--bg-alt)' }} className="py-28 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle,rgba(var(--c4-rgb),0.03) 0%,transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.p variants={fadeUp} className="text-xs tracking-[0.25em] uppercase font-mono mb-4" style={{ color: 'var(--saffron-text)' }}>02 / Skills</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold h2-grad mb-14" style={{ color: 'var(--c1)' }}>Technical Stack</motion.h2>

          <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillGroups.map(({ category, items }) => (
              <motion.div key={category} variants={fadeUp} className="p-6 rounded-2xl transition-all duration-350 group"
                style={{ border: '1px solid rgba(var(--c4-rgb),0.1)', background: 'rgba(var(--c4-rgb),0.02)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(var(--c1-rgb),0.15)'; e.currentTarget.style.background = 'rgba(var(--c1-rgb),0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--c4-rgb),0.1)'; e.currentTarget.style.background = 'rgba(var(--c4-rgb),0.02)'; }}>
                <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--saffron-text)' }}>{category}</p>
                {items.map(s => <SkillBar key={s.name} name={s.name} level={s.level} ac={ACC[category]} />)}
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-8">
            {iconStack.map(({ icon: Icon, name }, i) => (
              <div key={name} className="flex flex-col items-center gap-2 group cursor-default float" style={{ animationDelay: `${i * 0.35}s` }}>
                <Icon
                  className="transition-all duration-300 group-hover:scale-125 group-hover:-rotate-6 text-[color:var(--c4)] group-hover:text-[color:var(--gold)]"
                  style={{ fontSize: 36 }}
                />
                <span className="text-[10px] font-mono uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--c6)' }}>
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
