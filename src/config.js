// URL do backend. Defina VITE_API_URL no .env (local) ou nas variáveis da Vercel.
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')
