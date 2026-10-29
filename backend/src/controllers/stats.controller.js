import { supabase } from '../lib/supabase.js'
import { OPCOES } from '../lib/opcoes.js'

// GET /stats — só números agregados, sem dados pessoais
export async function getStats(req, res) {
  const [totalResult, contagensResult] = await Promise.all([
    supabase.from('respostas_reciclagem').select('id', { count: 'exact', head: true }),
    supabase.rpc('estatisticas_respostas'),   // GROUP BY no banco, sem limite de linhas
  ])

  const erro = totalResult.error ?? contagensResult.error
  if (erro) {
    console.error(erro)
    return res.status(500).json({ error: 'Não foi possível calcular as estatísticas.' })
  }

  const contagens = contagensResult.data ?? []
  const serie = (pergunta, opcoes) => contarOcorrencias(contagens, pergunta, opcoes)

  return res.json({
    total:          totalResult.count ?? 0,
    por_separacao:  serie('separa_lixo',       OPCOES.separa_lixo),
    por_frequencia: serie('frequencia',        OPCOES.frequencia),
    por_comunidade: serie('coleta_comunidade', OPCOES.coleta_comunidade),
    por_motivacao:  serie('motivacao',         OPCOES.motivacao),
    por_material:   serie('material',          OPCOES.materiais),
  })
}

// Inclui as opções sem nenhuma resposta (total 0) e ordena da mais para a menos votada
function contarOcorrencias(contagens, pergunta, opcoes) {
  const mapa = Object.fromEntries(opcoes.map(o => [o, 0]))
  for (const { pergunta: p, valor, total } of contagens) {
    if (p === pergunta && valor in mapa) mapa[valor] = Number(total)
  }
  return Object.entries(mapa)
    .map(([valor, total]) => ({ valor, total }))
    .sort((a, b) => b.total - a.total)
}
