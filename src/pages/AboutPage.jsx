import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Recycle, Sprout, TreePine, Users } from 'lucide-react'

const NUMEROS = [
  { valor: '1 bi+', label: 'toneladas de lixo geradas por ano no Brasil' },
  { valor: '3%',    label: 'apenas do lixo eletrônico é reciclado no país' },
  { valor: '91%',   label: 'do plástico nunca foi reciclado globalmente' },
  { valor: '50%',   label: 'redução possível do lixo doméstico com compostagem' },
]

const PILARES = [
  { icon: Recycle,   tone: 'tone-green', title: 'Reciclagem Inteligente',
    desc: 'Mapeamos os hábitos da comunidade para criar estratégias de coleta seletiva mais eficientes e acessíveis a todos.' },
  { icon: Users,     tone: 'tone-sky',   title: 'Engajamento Comunitário',
    desc: 'Acreditamos que a transformação começa nas pessoas. Campanhas, questionários e dados reais para mobilizar cada bairro.' },
  { icon: TreePine,  tone: 'tone-clay',  title: 'Impacto Ambiental Real',
    desc: 'Cada dado coletado se transforma em ação: menos resíduos nos aterros, menos emissão de CO₂ e cidades mais verdes.' },
  { icon: Lightbulb, tone: 'tone-sun',   title: 'Educação Ambiental',
    desc: 'Informação acessível sobre reciclagem, compostagem e consumo consciente para todas as idades e perfis.' },
]

const VIDEOS = [
  { id: 'ITur0JNJZos', title: 'Por que reciclar importa?',
    desc: 'A cadeia da reciclagem e seu impacto direto no meio ambiente urbano.' },
  { id: 'B-IoByiYUuE', title: 'Separação correta do lixo',
    desc: 'Como separar corretamente os resíduos em casa de forma simples e eficaz.' },
  { id: 'sfa-jnXtA84', title: 'O que nunca te contaram sobre o lixo',
    desc: 'Felipe Castanhari explica de forma animada tudo que acontece com o lixo que você descarta.' },
]

export default function AboutPage() {
  return (
    <div className="container">
      <header className="page-head fade-up">
        <span className="eyebrow"><span className="dot" /> Sobre o projeto</span>
        <h1 className="title">Construindo hábitos que <em>transformam</em> cidades</h1>
        <p className="lead">
          O projeto <strong>Cidade Sustentável</strong> nasce da convicção de que pequenas mudanças
          individuais, quando somadas, geram impacto urbano real. Usamos dados, educação e
          tecnologia para criar uma cultura de reciclagem duradoura.
        </p>
      </header>

      <section className="section">
        <p className="section-label">Em números</p>
        <div className="grid grid-4">
          {NUMEROS.map(({ valor, label }) => (
            <div key={label} className="card">
              <span className="stat-num">{valor}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <figure className="quote" style={{ margin: 0 }}>
          <p className="section-label"><Sprout size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Nossa missão</p>
          <blockquote>
            “Mapear, educar e engajar comunidades urbanas para transformar o descarte de resíduos em um
            hábito consciente, acessível e sustentável — contribuindo para cidades mais limpas e um
            planeta mais saudável.”
          </blockquote>
        </figure>
      </section>

      <section className="section">
        <p className="section-label">Os quatro pilares</p>
        <div className="grid grid-4">
          {PILARES.map(({ icon: Icon, tone, title, desc }) => (
            <div key={title} className="card">
              <span className={`icon-badge ${tone}`}><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section-label">Vídeos informativos</p>
        <div className="grid grid-3">
          {VIDEOS.map(({ id, title, desc }) => (
            <article key={id} className="card">
              <iframe
                className="video"
                src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
                title={title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta">
          <h2>Faça parte da mudança</h2>
          <p className="lead">
            Responda nosso questionário e ajude a construir um diagnóstico real dos hábitos de
            reciclagem na sua comunidade.
          </p>
          <div className="actions">
            <Link to="/projeto" className="btn btn-accent">
              <Sprout size={15} /> Participar do questionário <ArrowRight size={14} />
            </Link>
            <Link to="/timeline" className="btn btn-outline">Guia de reciclagem</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
