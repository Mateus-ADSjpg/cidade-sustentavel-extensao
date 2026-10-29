import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, ClipboardList, Route as RouteIcon, Sprout } from 'lucide-react'
import CityIllustration from '../components/CityIllustration'

const ATALHOS = [
  { to: '/sobre',    icon: BookOpen,      tone: 'tone-green', title: 'Sobre o projeto', desc: 'Nossa missão, os quatro pilares e vídeos para entender o problema do lixo urbano.' },
  { to: '/timeline', icon: RouteIcon,     tone: 'tone-sun',   title: 'Guia em 6 passos', desc: 'Um caminho prático para separar, reduzir, compostar e engajar sua comunidade.' },
  { to: '/projeto',  icon: ClipboardList, tone: 'tone-clay',  title: 'Questionário',    desc: 'Cinco perguntas rápidas para mapear os hábitos de reciclagem do seu bairro.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const clicks = useRef(0)
  const timer  = useRef(null)

  // Atalho escondido: 5 cliques no selo em até 2 s abrem o painel de resultados
  function handleBadgeClick() {
    clicks.current += 1
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { clicks.current = 0 }, 2000)
    if (clicks.current >= 5) {
      clicks.current = 0
      navigate('/dashboard')
    }
  }

  return (
    <>
      <section className="container hero">
        <div className="hero-text fade-up">
          <span className="eyebrow" onClick={handleBadgeClick}>
            <span className="dot" /> Projeto de Sustentabilidade Urbana
          </span>
          <h1 className="display">Construindo a <em>cidade</em> do futuro</h1>
          <p className="lead">
            Tecnologia, natureza e comunidade unidas para transformar
            espaços urbanos em ambientes mais sustentáveis.
          </p>
          <div className="actions">
            <Link to="/sobre" className="btn btn-primary">
              <Sprout size={16} /> Conhecer o projeto <ArrowRight size={15} />
            </Link>
            <Link to="/projeto" className="btn btn-outline">Responder questionário</Link>
          </div>
        </div>
        <CityIllustration className="hero-art fade-up d2" />
      </section>

      <section className="container section">
        <div className="grid grid-3">
          {ATALHOS.map(({ to, icon: Icon, tone, title, desc }, i) => (
            <Link key={to} to={to} className={`card fade-up d${i + 1}`}>
              <span className={`icon-badge ${tone}`}><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="card-link">Abrir <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
