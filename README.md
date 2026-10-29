# Cidade Sustentável

Site educativo sobre reciclagem com um **questionário de hábitos** da comunidade e um **painel de resultados**.

Recriação com novo design do projeto original de [MAGGZS/Cidade-sustent-vel](https://github.com/MAGGZS/Cidade-sustent-vel), feita a partir da engenharia reversa do código e com as falhas de segurança corrigidas.

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Início |
| `/sobre` | Missão, números, quatro pilares, vídeos |
| `/timeline` | Guia de reciclagem em 6 passos |
| `/projeto` | Questionário (e-mail + 5 perguntas) |
| `/dashboard` | Painel de estatísticas. Atalho: 5 cliques no selo da página inicial |

## Estrutura

```
├── src/            Frontend (React 19 + Vite + React Router)
├── backend/        API (Node + Express 5 + Supabase)
└── database/       schema.sql para o Supabase
```

## Como rodar

### 1. Banco (Supabase)
1. Crie um projeto em https://supabase.com.
2. Abra o **SQL Editor**, cole `database/schema.sql` e execute.

### 2. Backend
```bash
cd backend
cp .env.example .env     # preencha SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e ADMIN_TOKEN
npm install
npm run dev              # http://localhost:3001
```

### 3. Frontend
```bash
cp .env.example .env     # VITE_API_URL=http://localhost:3001
npm install
npm run dev              # http://localhost:5173
```

## API

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/respostas` | público | Salva uma resposta (409 se o e-mail já respondeu) |
| POST | `/respostas/verificar-email` | público | Retorna `{ jaRespondeu }` |
| GET | `/stats` | público | Contagens agregadas (sem dados pessoais) |
| GET | `/respostas` | admin | Lista todas as respostas |
| GET | `/respostas/:id` | admin | Busca uma resposta |
| DELETE | `/respostas/:id` | admin | Remove uma resposta |
| GET | `/health` | público | Verificação de funcionamento |

As rotas de admin exigem o header `x-admin-token: <ADMIN_TOKEN>`.

## O que mudou em relação ao original

**Design:** tema claro "papel reciclado" (creme, verde-escuro e terracota), tipografia Fraunces + DM Sans, ilustração vetorial própria, menu de navegação fixo e CSS próprio com variáveis no lugar de estilos inline e Tailwind.

**Segurança e dados:**
- Nenhuma senha ou chave no repositório. Tudo fica em `.env`, que está no `.gitignore`.
- A lista de e-mails não é mais pública. A checagem de duplicidade usa `POST /respostas/verificar-email`.
- `GET` e `DELETE` de respostas exigem token de administrador.
- `UNIQUE(email)` no banco: a regra "um e-mail, uma resposta" vale também para quem chama a API direto.
- Resposta e materiais são gravados em uma única transação (`registrar_resposta`).
- Validação de todos os valores no backend. "Nenhum" não pode ser combinado com outros materiais.
- `/stats` trata erros e agrega no banco (sem o limite de 1000 linhas do Supabase).
- Consentimento LGPD antes de coletar o e-mail.
- URL da API configurável por variável de ambiente (`VITE_API_URL`).

## Deploy
- **Frontend:** Vercel (`vercel.json` já configura o roteamento da SPA). Defina `VITE_API_URL`.
- **Backend:** Render, com raiz `backend/`, build `npm install` e start `npm start`. Defina as variáveis do `.env.example`.
