import { SiC, SiCplusplus, SiJavascript, SiPython, SiHtml5, SiCss, SiGit, SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss, SiPytorch, SiDocker } from 'react-icons/si'

const row1 = [['C', SiC], ['C++', SiCplusplus], ['JavaScript', SiJavascript], ['Python', SiPython], ['HTML5', SiHtml5], ['CSS3', SiCss], ['Git', SiGit]]
const row2 = [['React', SiReact], ['Node.js', SiNodedotjs], ['Express', SiExpress], ['MongoDB', SiMongodb], ['Tailwind', SiTailwindcss], ['PyTorch', SiPytorch], ['Docker', SiDocker]]

function Row({ items, rev }) {
  const list = [...items, ...items, ...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track${rev ? ' rev' : ''}`}>
        {list.map(([name, Icon], i) => (
          <span key={i} className="group flex items-center gap-3 px-6 whitespace-nowrap cursor-default">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <Icon className="text-lg text-[color:var(--c4)] group-hover:text-[color:var(--gold)] transition-colors" />
            </span>
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--c4)' }}>{name}</span>
            <span className="w-1 h-1 rounded-full ml-3" style={{ background: 'var(--gold)' }} />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="marquee py-7 grid gap-4" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <Row items={row1} />
      <Row items={row2} rev />
    </div>
  )
}
