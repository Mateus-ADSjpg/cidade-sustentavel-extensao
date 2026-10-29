import { useEffect, useState } from 'react'
import { MapPin, Recycle, RefreshCw, Users } from 'lucide-react'
import { API_URL } from '../config'
import { PERGUNTAS } from '../data/perguntas'

const BLOCOS = [
  { chave: 'por_separacao',  campo: 'separa_lixo',       titulo: 'Separação do lixo',      cor: 'var(--green)' },
  { chave: 'por_material',   campo: 'materiais',         titulo: 'Materiais reciclados',   cor: 'var(--sky)' },
  { chave: 'por_frequencia', campo: 'frequencia',        titulo: 'Frequência de descarte', cor: 'var(--sun)' },
  { chave: 'por_comunidade', campo: 'coleta_comunidade', titulo: 'Coleta na comunidade',   cor: 'var(--clay)' },
  { chave: 'por_motivacao',  campo: 'motivacao',         titulo: 'O que motiva mais',      cor: 'var(--berry)' },
]

const pergunta = campo => PERGUNTAS.find(p => p.campo === campo)?.pergunta

function pct(parte, total) {
  return total ? Math.round((parte / total) * 100) : 0
}

function Skel({ w = '100%', h = 18 }) {
  return <div className="skel" style={{ width: w, height: h }} />
}

function Barras({ itens, total, cor }) {
  return (
    <ul className="bars">
      {itens.map(({ valor, total: n }) => (
        <li key={valor} className="bar-row">
          <div className="bar-top">
            <span>{valor}</span>
            <strong>{pct(n, total)}% · {n}</strong>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${pct(n, total)}%`, background: cor }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function DashboardPage() {
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  async function fetchStats() {
    setLoading(true); setError(false)
    try {
      const res = await fetch(`${API_URL}/stats`)
      if (!res.ok) throw new Error()
      setStats(await res.json())
      setLastUpdate(new Date())
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStats() }, [])

  const total       = stats?.total ?? 0
  const sempre      = stats?.por_separacao?.find(x => x.valor === 'Sim, sempre')?.total ?? 0
  const funciona    = stats?.por_comunidade?.find(x => x.valor === 'Sim, funciona bem')?.total ?? 0

  const KPIS = [
    { label: 'Total de respostas',  icon: Users,   valor: total.toLocaleString('pt-BR'), sufixo: '',  sub: 'participantes registrados' },
    { label: 'Separam sempre',      icon: Recycle, valor: pct(sempre, total),            sufixo: '%', sub: 'dos respondentes' },
    { label: 'Coleta funciona bem', icon: MapPin,  valor: pct(funciona, total),          sufixo: '%', sub: 'das comunidades' },
  ]

  return (
    <div className="container">
      <header className="dash-head fade-up">
        <div>
          <span className="eyebrow"><span className="dot" /> Painel de resultados</span>
          <h1 className="title">Estatísticas</h1>
        </div>
        <button type="button" className="btn btn-outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'spin' : undefined} /> Atualizar
        </button>
      </header>

      {error && (
        <div className="notice" role="alert">
          Erro ao carregar os dados.
          <button type="button" className="btn btn-ghost" onClick={fetchStats}>Tentar novamente</button>
        </div>
      )}

      <div className="grid grid-3">
        {KPIS.map(({ label, icon: Icon, valor, sufixo, sub }) => (
          <div key={label} className="card">
            <p className="kpi-label">{label} <Icon size={16} /></p>
            {loading
              ? <Skel w={110} h={48} />
              : <p className="kpi-value">{valor}<small>{sufixo}</small></p>}
            <p className="muted">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        {BLOCOS.map(({ chave, campo, titulo, cor }, i) => (
          <section key={chave} className={`card${i === BLOCOS.length - 1 ? ' span-all' : ''}`}>
            <h3>{titulo}</h3>
            <p className="card-question">{pergunta(campo)}</p>
            {loading
              ? [1, 2, 3, 4].map(k => <Skel key={k} h={26} />)
              : <Barras itens={stats?.[chave] ?? []} total={total} cor={cor} />}
          </section>
        ))}
      </div>

      <div className="dash-foot muted">
        <span>Percentuais calculados sobre o total de respondentes. Em “Materiais”, cada pessoa pode marcar mais de uma opção.</span>
        {lastUpdate && <span>Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
      </div>
    </div>
  )
}
