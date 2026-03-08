-- =============================================
-- VERIFICAÇÃO DO SISTEMA DE USUÁRIOS
-- =============================================
-- Execute no Supabase SQL Editor para verificar se está funcionando

-- 1. VERIFICAR SE TABELAS EXISTEM
SELECT 
  table_name,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'activity_log', 'products', 'designs', 'orders')
ORDER BY table_name;

-- 2. VERIFICAR TRIGGER DE AUTO-CRIAÇÃO DE PERFIL
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. VERIFICAR SE HÁ USUÁRIOS NO AUTH
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'full_name' as full_name
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 4. VERIFICAR SE HÁ PERFIS CRIADOS
SELECT 
  up.id,
  up.user_id,
  up.display_name,
  up.xp_points,
  up.level,
  up.total_orders,
  up.created_at,
  u.email
FROM user_profiles up
LEFT JOIN auth.users u ON u.id = up.user_id
ORDER BY up.created_at DESC
LIMIT 10;

-- 5. VERIFICAR HISTÓRICO DE ATIVIDADES
SELECT 
  al.id,
  al.user_id,
  al.action_type,
  al.xp_earned,
  al.created_at,
  u.email
FROM activity_log al
LEFT JOIN auth.users u ON u.id = al.user_id
ORDER BY al.created_at DESC
LIMIT 10;

-- =============================================
-- DIAGNÓSTICO
-- =============================================
-- Se "user_profiles" NÃO aparecer na primeira query:
--   → Execute: supabase-user-profiles-migration.sql
--
-- Se "on_auth_user_created" NÃO aparecer na segunda query:
--   → O trigger não existe. Execute a migration novamente.
--
-- Se auth.users tem dados MAS user_profiles está vazio:
--   → O trigger não executou. Precisa criar perfis manualmente
--   → OU os usuários foram criados ANTES do trigger ser instalado
--
-- SOLUÇÃO: Criar perfis para usuários existentes:
-- 
-- INSERT INTO user_profiles (user_id, display_name)
-- SELECT 
--   id,
--   COALESCE(raw_user_meta_data->>'full_name', SPLIT_PART(email, '@', 1))
-- FROM auth.users
-- WHERE id NOT IN (SELECT user_id FROM user_profiles);
