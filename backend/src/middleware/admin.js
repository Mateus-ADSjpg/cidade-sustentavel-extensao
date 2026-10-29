import { timingSafeEqual } from 'node:crypto'

// Libera a rota só quando o header x-admin-token bate com ADMIN_TOKEN
export function exigirAdmin(req, res, next) {
  const esperado = Buffer.from(process.env.ADMIN_TOKEN ?? '')
  const recebido = Buffer.from(req.get('x-admin-token') ?? '')

  if (esperado.length === 0 || recebido.length !== esperado.length || !timingSafeEqual(recebido, esperado)) {
    return res.status(401).json({ error: 'Não autorizado.' })
  }
  next()
}
