-- ══════════════════════════════════════════════════════════════
--  Cidade Sustentável — Schema Supabase (PostgreSQL)
--  Cole no SQL Editor do seu projeto Supabase e execute uma vez.
-- ══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────────
--  Tipos ENUM (um por pergunta)
-- ──────────────────────────────────────────────────────────────
CREATE TYPE separa_lixo_enum AS ENUM (
  'Sim, sempre', 'Às vezes', 'Raramente', 'Não separo'
);

CREATE TYPE frequencia_enum AS ENUM (
  'Toda semana', 'A cada 15 dias', 'Uma vez por mês', 'Raramente'
);

CREATE TYPE coleta_comunidade_enum AS ENUM (
  'Sim, funciona bem', 'Sim, mas é irregular', 'Não tem', 'Não sei'
);

CREATE TYPE motivacao_enum AS ENUM (
  'Mais pontos de coleta', 'Educação e campanhas',
  'Benefícios ou recompensas', 'Já reciclo bastante'
);

CREATE TYPE material_enum AS ENUM (
  'Papel e papelão', 'Plástico', 'Vidro', 'Metal', 'Orgânico', 'Nenhum'
);

-- ──────────────────────────────────────────────────────────────
--  Tabelas
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS respostas_reciclagem (
  id                UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT                   NOT NULL UNIQUE CHECK (email = lower(email)),
  criado_em         TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  separa_lixo       separa_lixo_enum       NOT NULL,
  frequencia        frequencia_enum        NOT NULL,
  coleta_comunidade coleta_comunidade_enum NOT NULL,
  motivacao         motivacao_enum         NOT NULL
);

CREATE TABLE IF NOT EXISTS materiais_reciclados (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  resposta_id UUID          NOT NULL REFERENCES respostas_reciclagem(id) ON DELETE CASCADE,
  material    material_enum NOT NULL,
  UNIQUE (resposta_id, material)
);

CREATE INDEX IF NOT EXISTS idx_respostas_criado_em ON respostas_reciclagem(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_materiais_resposta  ON materiais_reciclados(resposta_id);

-- ──────────────────────────────────────────────────────────────
--  Row Level Security
--  Sem políticas = ninguém acessa pela chave pública (anon).
--  Só o backend, com a chave service_role, lê e grava.
-- ──────────────────────────────────────────────────────────────
ALTER TABLE respostas_reciclagem ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiais_reciclados ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
--  Função: grava resposta + materiais de forma atômica
--  (se qualquer insert falhar, nada é salvo)
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION registrar_resposta(
  p_email             TEXT,
  p_separa_lixo       TEXT,
  p_frequencia        TEXT,
  p_coleta_comunidade TEXT,
  p_motivacao         TEXT,
  p_materiais         TEXT[]
) RETURNS UUID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO respostas_reciclagem (email, separa_lixo, frequencia, coleta_comunidade, motivacao)
  VALUES (
    lower(trim(p_email)),
    p_separa_lixo::separa_lixo_enum,
    p_frequencia::frequencia_enum,
    p_coleta_comunidade::coleta_comunidade_enum,
    p_motivacao::motivacao_enum
  )
  RETURNING id INTO v_id;

  INSERT INTO materiais_reciclados (resposta_id, material)
  SELECT v_id, m::material_enum
  FROM unnest(p_materiais) AS m;

  RETURN v_id;
END;
$$;

-- ──────────────────────────────────────────────────────────────
--  Função: contagens agregadas para o painel
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION estatisticas_respostas()
RETURNS TABLE (pergunta TEXT, valor TEXT, total BIGINT)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT 'separa_lixo',       separa_lixo::TEXT,       COUNT(*) FROM respostas_reciclagem GROUP BY 2
  UNION ALL
  SELECT 'frequencia',        frequencia::TEXT,        COUNT(*) FROM respostas_reciclagem GROUP BY 2
  UNION ALL
  SELECT 'coleta_comunidade', coleta_comunidade::TEXT, COUNT(*) FROM respostas_reciclagem GROUP BY 2
  UNION ALL
  SELECT 'motivacao',         motivacao::TEXT,         COUNT(*) FROM respostas_reciclagem GROUP BY 2
  UNION ALL
  SELECT 'material',          material::TEXT,          COUNT(*) FROM materiais_reciclados GROUP BY 2
$$;

-- As funções só podem ser chamadas pelo backend (service_role)
REVOKE EXECUTE ON FUNCTION registrar_resposta(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION estatisticas_respostas() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION registrar_resposta(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) TO service_role;
GRANT  EXECUTE ON FUNCTION estatisticas_respostas() TO service_role;
