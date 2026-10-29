import { Router } from 'express'
import { exigirAdmin } from '../middleware/admin.js'
import {
  criarResposta,
  verificarEmail,
  listarRespostas,
  buscarResposta,
  deletarResposta,
} from '../controllers/respostas.controller.js'

const router = Router()

// Públicas
router.post('/',                criarResposta)
router.post('/verificar-email', verificarEmail)

// Administrativas (expõem e-mails ou apagam dados)
router.get('/',       exigirAdmin, listarRespostas)
router.get('/:id',    exigirAdmin, buscarResposta)
router.delete('/:id', exigirAdmin, deletarResposta)

export default router
