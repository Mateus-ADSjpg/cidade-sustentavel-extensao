import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Lightbulb, MapPin, Repeat2, ScanLine, Trash2 } from 'lucide-react'

const STEPS = [
  { icon: Trash2,    tone: 'tone-green', title: 'Separe na Fonte',
    desc: 'Comece separando o lixo em casa em pelo menos dois grupos: recicláveis (plástico, papel, vidro, metal) e orgânicos. Use lixeiras com cores diferentes para criar o hábito naturalmente.' },
  { icon: ScanLine,  tone: 'tone-sky',   title: 'Identifique os Materiais',
    desc: 'Aprenda a identificar os símbolos de reciclagem nas embalagens. Plásticos têm números de 1 a 7 que indicam o tipo — nem todos são aceitos nos mesmos pontos de coleta.' },
  { icon: MapPin,    tone: 'tone-sun',   title: 'Encontre Pontos de Coleta',
    desc: 'Localize o ecoponto ou ponto de entrega voluntária (PEV) mais próximo. Muitos supermercados e farmácias já possuem coletores específicos para pilhas, eletrônicos e embalagens.' },
  { icon: Repeat2,   tone: 'tone-berry', title: 'Reduza Antes de Reciclar',
    desc: 'A reciclagem é a última etapa — antes disso, reduza o consumo e reutilize. Prefira produtos a granel, embalagens retornáveis e evite o descartável sempre que possível.' },
  { icon: Leaf,      tone: 'tone-green', title: 'Compostagem em Casa',
    desc: 'Resíduos orgânicos como cascas e restos de comida podem ser transformados em adubo por meio da compostagem. É simples, não gera odor e reduz em até 50% o volume do seu lixo.' },
  { icon: Lightbulb, tone: 'tone-clay',  title: 'Engaje sua Comunidade',
    desc: 'Compartilhe o conhecimento com vizinhos, escolas e grupos locais. Uma comunidade informada gera impacto coletivo: menos lixo nos aterros, menos emissão de gases e cidades mais limpas.' },
]

export default function TimelinePage() {
  return (
    <div className="container narrow">
      <header className="page-head fade-up">
        <span className="eyebrow"><span className="dot" /> Guia de Reciclagem Inteligente</span>
        <h1 className="title">Como reciclar de forma <em>inteligente</em></h1>
        <p className="lead">
          Seis passos práticos para transformar seus hábitos e gerar impacto real na sua comunidade.
        </p>
      </header>

      <ol className="steps" aria-label="Passos do guia">
        {STEPS.map(({ icon: Icon, tone, title, desc }, i) => (
          <li key={title} className="step fade-up">
            <span className="step-num" aria-hidden="true">{i + 1}</span>
            <div className="step-body">
              <div className="step-title">
                <span className={`step-tag ${tone}`}><Icon size={17} /></span>
                <h3>{title}</h3>
              </div>
              <p>{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="section">
        <div className="cta">
          <h2>Já pratica algum desses passos?</h2>
          <p className="lead">Conte para a gente no questionário — leva menos de um minuto.</p>
          <Link to="/projeto" className="btn btn-primary">Responder questionário <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  )
}
