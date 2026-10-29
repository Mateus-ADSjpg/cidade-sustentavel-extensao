import { supabase } from '../lib/supabase.js'
import { OPCOES } from '../lib/opcoes.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CAMPOS_UNICOS = ['separa_lixo', 'frequencia', 'coleta_comunidade', 'motivacao']
const SELECT_COMPLETO = `
  id, email, separa_lixo, frequencia, coleta_comunidade, motivacao, criado_em,
  materiais_reciclados ( material )
`

function normalizarEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

// POST /respostas — salva resposta + materiais numa única transação (função SQL)
export async function criarResposta(req, res) {
  const body  = req.body ?? {}
  const email = normalizarEmail(body.email)
  const materiais = Array.isArray(body.materiais) ? [...new Set(body.materiais)] : []

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' })
  }
  for (const campo of CAMPOS_UNICOS) {
    if (!OPCOES[campo].includes(body[campo])) {
      return res.status(400).json({ error: `Valor inválido para "${campo}".` })
    }
  }
  if (materiais.length === 0 || !materiais.every(m => OPCOES.materiais.includes(m))) {
    return res.status(400).json({ error: 'Selecione ao menos um material válido.' })
  }
  if (materiais.includes('Nenhum') && materiais.length > 1) {
    return res.status(400).json({ error: '"Nenhum" não pode ser combinado com outros materiais.' })
  }

  const { data, error } = await supabase.rpc('registrar_resposta', {
    p_email:             email,
    p_separa_lixo:       body.separa_lixo,
    p_frequencia:        body.frequencia,
    p_coleta_comunidade: body.coleta_comunidade,
    p_motivacao:         body.motivacao,
    p_materiais:         materiais,
  })

  // 23505 = violação de UNIQUE (e-mail já respondeu)
  if (error?.code === '23505') return res.status(409).json({ error: 'Este e-mail já respondeu o questionário.' })
  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Não foi possível salvar a resposta.' })
  }
  return res.status(201).json({ id: data })
}

// POST /respostas/verificar-email — responde só se o e-mail já participou
export async function verificarEmail(req, res) {
  const email = normalizarEmail(req.body?.email)
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'E-mail inválido.' })

  const { count, error } = await supabase
    .from('respostas_reciclagem')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Não foi possível verificar o e-mail.' })
  }
  return res.json({ jaRespondeu: count > 0 })
}

// GET /respostas — lista todas com materiais (admin)
export async function listarRespostas(req, res) {
  const { data, error } = await supabase
    .from('respostas_reciclagem')
    .select(SELECT_COMPLETO)
    .order('criado_em', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  return res.json(data)
}

// GET /respostas/:id — busca uma resposta por id (admin)
export async function buscarResposta(req, res) {
  const { data, error } = await supabase
    .from('respostas_reciclagem')
    .select(SELECT_COMPLETO)
    .eq('id', req.params.id)
    .maybeSingle()

  // 22P02 = id não é um UUID válido
  if (error && error.code !== '22P02') return res.status(500).json({ error: error.message })
  if (!data) return res.status(404).json({ error: 'Resposta não encontrada.' })
  return res.json(data)
}

// DELETE /respostas/:id — remove uma resposta (admin)
export async function deletarResposta(req, res) {
  const { data, error } = await supabase
    .from('respostas_reciclagem')
    .delete()
    .eq('id', req.params.id)
    .select('id')

  if (error && error.code !== '22P02') return res.status(500).json({ error: error.message })
  if (!data?.length) return res.status(404).json({ error: 'Resposta não encontrada.' })
  return res.json({ message: 'Resposta removida com sucesso.' })
}
