// As opções precisam bater exatamente com os ENUMs do banco (database/schema.sql)
// e com backend/src/lib/opcoes.js.

export const NENHUM = 'Nenhum'

export const PERGUNTAS = [
  {
    campo: 'separa_lixo',
    pergunta: 'Você separa o lixo em casa?',
    opcoes: ['Sim, sempre', 'Às vezes', 'Raramente', 'Não separo'],
  },
  {
    campo: 'materiais',
    pergunta: 'Quais materiais você recicla?',
    dica: 'Selecione todos que se aplicam',
    multipla: true,
    opcoes: ['Papel e papelão', 'Plástico', 'Vidro', 'Metal', 'Orgânico', NENHUM],
  },
  {
    campo: 'frequencia',
    pergunta: 'Com que frequência você descarta no ponto de coleta?',
    opcoes: ['Toda semana', 'A cada 15 dias', 'Uma vez por mês', 'Raramente'],
  },
  {
    campo: 'coleta_comunidade',
    pergunta: 'Sua comunidade tem coleta seletiva?',
    opcoes: ['Sim, funciona bem', 'Sim, mas é irregular', 'Não tem', 'Não sei'],
  },
  {
    campo: 'motivacao',
    pergunta: 'O que te motivaria a reciclar mais?',
    opcoes: ['Mais pontos de coleta', 'Educação e campanhas', 'Benefícios ou recompensas', 'Já reciclo bastante'],
  },
]
