/**
 * Supabase Database Verification Script
 * Checks if user_profiles table, triggers, and data exist
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://elgomlavjxzzszdjumyx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZ29tbGF2anh6enN6ZGp1bXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMzAyNiwiZXhwIjoyMDg0MDc5MDI2fQ.WXEfqm01wMrFuKBfs1F7KNyqCg0w1t1AVy7hk5gaI6Y';

// Create admin client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTables() {
  console.log('\n🔍 1. VERIFICANDO TABELAS...\n');
  
  const tablesToCheck = ['user_profiles', 'activity_log', 'products', 'designs', 'orders'];
  const results = [];
  
  for (const table of tablesToCheck) {
    const { error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${table}: NÃO EXISTE`);
      results.push({ table, exists: false });
    } else {
      console.log(`✅ ${table}: existe (${count || 0} registros)`);
      results.push({ table, exists: true, count });
    }
  }
  
  return results;
}

async function checkAuthUsers() {
  console.log('\n🔍 2. VERIFICANDO USUÁRIOS AUTH...\n');
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Erro:', error.message);
    return [];
  }
  
  console.log(`Total de usuários: ${users.length}`);
  
  if (users.length > 0) {
    console.log('\nÚltimos 5 usuários:');
    users.slice(0, 5).forEach((user, i) => {
      const createdAt = new Date(user.created_at).toLocaleString('pt-BR');
      const name = user.user_metadata?.full_name || 'N/A';
      console.log(`${i + 1}. ${user.email} | Nome: ${name} | Criado: ${createdAt}`);
    });
  }
  
  return users;
}

async function checkUserProfiles() {
  console.log('\n🔍 3. VERIFICANDO USER_PROFILES...\n');
  
  const { data, error, count } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('❌ Tabela user_profiles não existe ou não está acessível');
    console.error('   Erro:', error.message);
    return null;
  }
  
  console.log(`Total de perfis: ${count || (data ? data.length : 0)}`);
  
  if (data && data.length > 0) {
    console.log('\nÚltimos perfis criados:');
    data.forEach((p, i) => {
      const created = new Date(p.created_at).toLocaleString('pt-BR');
      console.log(`${i + 1}. ${p.display_name || 'Sem nome'} | Level ${p.level} | XP: ${p.xp_points} | Pedidos: ${p.total_orders} | ${created}`);
    });
  } else {
    console.log('⚠️  Nenhum perfil encontrado');
  }
  
  return data;
}

async function checkSync(users, profiles) {
  console.log('\n🔍 4. VERIFICANDO SINCRONIZAÇÃO AUTH <-> PROFILES...\n');
  
  const usersCount = users.length;
  const profilesCount = profiles ? profiles.length : 0;
  
  // Get actual count
  const { count } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Usuários em auth.users: ${usersCount}`);
  console.log(`Perfis em user_profiles: ${count || 0}`);
  
  if (usersCount === count) {
    console.log('✅ SINCRONIZADO - Todos os usuários têm perfil');
  } else if (usersCount > (count || 0)) {
    console.log('⚠️  DESSINCRONIZADO - Faltam perfis!');
    console.log(`   ${usersCount - (count || 0)} usuários sem perfil`);
    
    // Check which users don't have profiles
    if (profiles) {
      const profileUserIds = new Set(profiles.map(p => p.user_id));
      const missingProfiles = users.filter(u => !profileUserIds.has(u.id));
      
      if (missingProfiles.length > 0) {
        console.log('\nUsuários sem perfil:');
        missingProfiles.forEach((u, i) => {
          console.log(`${i + 1}. ${u.email}`);
        });
      }
    }
  } else {
    console.log('⚠️  INCONSISTENTE - Mais perfis que usuários (dados órfãos)');
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  SUPABASE DATABASE VERIFICATION');
  console.log('  Projeto: Mimmus (elgomlavjxzzszdjumyx)');
  console.log('═══════════════════════════════════════════');
  
  try {
    const tables = await checkTables();
    const users = await checkAuthUsers();
    const profiles = await checkUserProfiles();
    await checkSync(users, profiles);
    
    console.log('\n═══════════════════════════════════════════');
    console.log('✅ VERIFICAÇÃO COMPLETA');
    console.log('═══════════════════════════════════════════\n');
    
    // Summary
    const hasUserProfiles = tables.find(t => t.table === 'user_profiles')?.exists;
    
    if (!hasUserProfiles) {
      console.log('📋 PRÓXIMO PASSO:');
      console.log('   Execute as migrations SQL no Supabase Dashboard');
      console.log('   1. supabase-schema.sql');
      console.log('   2. supabase-user-profiles-migration.sql');
    } else if (users.length > 0 && (!profiles || profiles.length === 0)) {
      console.log('📋 PRÓXIMO PASSO:');
      console.log('   Criar perfis para usuários existentes OU');
      console.log('   Verificar se o trigger está ativo');
    }
    
  } catch (err) {
    console.error('\n❌ ERRO NA VERIFICAÇÃO:', err.message);
    process.exit(1);
  }
}

main();
