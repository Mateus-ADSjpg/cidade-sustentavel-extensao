import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { API_URL } from '../config'
import { NENHUM, PERGUNTAS } from '../data/perguntas'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LETRAS = 'ABCDEF'

export default function ProjectPage() {
  // fases: 'email' → 'perguntas' → 'concluido' (ou 'ja-respondeu')
  const [fase, setFase]         = useState('email')
  const [email, setEmail]       = useState('')
  const [consent, setConsent]   = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [checking, setChecking] = useState(false)
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState({})
  const [sending, setSending]   = useState(false)
  const [sendErr, setSendErr]   = useState(false)

  async function submitEmail(e) {
    e.preventDefault()
    const valor = email.trim().toLowerCase()
    if (!EMAIL_RE.test(valor)) { setEmailErr('Digite um e-mail válido para continuar.'); return }
    if (!consent) { setEmailErr('Para participar, confirme que concorda com o uso do e-mail.'); return }

    setEmail(valor)
    setEmailErr('')
    setChecking(true)
    try {
      const res = await fetch(`${API_URL}/respostas/verificar-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: valor }),
      })
      if (!res.ok) throw new Error()
      const { jaRespondeu } = await res.json()
      setFase(jaRespondeu ? 'ja-respondeu' : 'perguntas')
    } catch {
      // O backend também recusa e-mails repetidos no envio, então dá para seguir
      setFase('perguntas')
    } finally {
      setChecking(false)
    }
  }

  async function submitForm() {
    setSending(true)
    setSendErr(false)
    try {
      const res = await fetch(`${API_URL}/respostas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ...answers, materiais: answers.materiais ?? [] }),
      })
      if (res.status === 409) { setFase('ja-respondeu'); return }
      if (!res.ok) throw new Error()
      setFase('concluido')
    } catch {
      setSendErr(true)
    } finally {
      setSending(false)
    }
  }

  const current = PERGUNTAS[step]
  const answer  = answers[current.campo]
  const canNext = current.multipla ? answer?.length > 0 : !!answer

  function select(opt) {
    setAnswers(a => {
      if (!current.multipla) return { ...a, [current.campo]: opt }
      const prev = a[current.campo] ?? []
      let nova
      if (prev.includes(opt)) nova = prev.filter(x => x !== opt)
      else if (opt === NENHUM) nova = [NENHUM]                       // "Nenhum" exclui os demais
      else nova = [...prev.filter(x => x !== NENHUM), opt]
      return { ...a, [current.campo]: nova }
    })
  }

  function next() {
    if (step < PERGUNTAS.length - 1) setStep(s => s + 1)
    else submitForm()
  }

  function recomecar() {
    setFase('email'); setEmail(''); setConsent(false)
    setStep(0); setAnswers({}); setSendErr(false)
  }

  return (
    <div className="container">
      <div className="quiz-wrap">
        {fase === 'email' && (
          <form className="quiz fade-up" onSubmit={submitEmail} noValidate>
            <div>
              <span className="eyebrow"><span className="dot" /> Antes de começar</span>
              <h2 style={{ marginTop: 12 }}>Informe seu e-mail</h2>
              <p className="hint">Usamos o e-mail só para garantir uma participação por pessoa.</p>
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email" type="email" className="input" placeholder="seu@email.com" autoComplete="email"
                value={email} aria-invalid={!!emailErr}
                onChange={e => { setEmail(e.target.value); setEmailErr('') }}
              />
            </div>

            <label className="check">
              <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setEmailErr('') }} />
              Concordo que meu e-mail seja armazenado apenas para registrar minha participação nesta
              pesquisa, sem divulgação ou uso para outros fins (LGPD).
            </label>

            {emailErr && <p className="error" role="alert">{emailErr}</p>}

            <div className="quiz-footer">
              <span />
              <button type="submit" className="btn btn-primary" disabled={checking}>
                {checking ? 'Verificando...' : <>Continuar <ArrowRight size={15} /></>}
              </button>
            </div>
          </form>
        )}

        {fase === 'perguntas' && (
          <div className="quiz fade-up" key={step}>
            <div>
              <div className="progress-meta">
                <span>Pergunta {step + 1} de {PERGUNTAS.length}</span>
                <span>{Math.round((step / PERGUNTAS.length) * 100)}%</span>
              </div>
              <div className="progress" aria-hidden="true">
                <span style={{ width: `${((step + (canNext ? 1 : 0.35)) / PERGUNTAS.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <h2>{current.pergunta}</h2>
              {current.dica && <p className="hint">{current.dica}</p>}
            </div>

            <div className="options" role="group" aria-label={current.pergunta}>
              {current.opcoes.map((opt, i) => {
                const selected = current.multipla ? (answer ?? []).includes(opt) : answer === opt
                return (
                  <button key={opt} type="button" className="option" aria-pressed={selected} onClick={() => select(opt)}>
                    <span className="option-key">{LETRAS[i]}</span>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>

            {sendErr && <p className="error" role="alert">Erro ao enviar. Verifique sua conexão e tente novamente.</p>}

            <div className="quiz-footer">
              {step > 0
                ? <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)}><ArrowLeft size={15} /> Anterior</button>
                : <span />}
              <button type="button" className="btn btn-primary" onClick={next} disabled={!canNext || sending}>
                {step < PERGUNTAS.length - 1 ? <>Próxima <ArrowRight size={15} /></> : sending ? 'Enviando...' : <>Enviar respostas <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>
        )}

        {fase === 'ja-respondeu' && (
          <div className="quiz result fade-up">
            <span className="result-icon tone-clay"><XCircle size={30} /></span>
            <h2>Você já participou!</h2>
            <p>Este e-mail já foi usado para responder o questionário. Cada e-mail só pode participar uma vez.</p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn btn-outline" onClick={recomecar}>Usar outro e-mail</button>
              <Link to="/timeline" className="btn btn-primary">Ver guia de reciclagem <ArrowRight size={15} /></Link>
            </div>
          </div>
        )}

        {fase === 'concluido' && (
          <div className="quiz result fade-up">
            <span className="result-icon tone-green"><CheckCircle2 size={30} /></span>
            <h2>Obrigado!</h2>
            <p>Suas respostas vão nos ajudar a entender melhor os hábitos de reciclagem na sua comunidade.</p>
            <Link to="/timeline" className="btn btn-primary">Ver guia de reciclagem <ArrowRight size={15} /></Link>
          </div>
        )}
      </div>
    </div>
  )
}
