#!/usr/bin/env node
/**
 * Supabase Database Verification Script
 * Checks if user_profiles table, triggers, and data exist
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTables() {
  console.log('\n🔍 1. VERIFICANDO TABELAS...\n');
  
  const { data, error } = await supabase.rpc('check_tables', {});
  
  // If RPC doesn't exist, query directly
  const query = `
    SELECT 
      table_name,
      (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
    FROM information_schema.tables t
    WHERE table_schema = 'public' 
      AND table_name IN ('user_profiles', 'activity_log', 'products', 'designs', 'orders')
    ORDER BY table_name;
  `;
  
  const { data: tables, error: tablesError } = await supabase.rpc('exec_sql', { sql: query });
  
  if (tablesError) {
    // Fallback: check each table individually
    const tablesToCheck = ['user_profiles', 'activity_log', 'products', 'designs', 'orders'];
    
    for (const table of tablesToCheck) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: NÃO EXISTE`);
      } else {
        console.log(`✅ ${table}: existe (${count || 0} registros)`);
      }
    }
  } else {
    console.table(tables);
  }
}

async function checkAuthUsers() {
  console.log('\n🔍 2. VERIFICANDO USUÁRIOS AUTH...\n');
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  console.log(`Total de usuários: ${users.length}`);
  
  if (users.length > 0) {
    console.log('\nÚltimos 5 usuários:');
    users.slice(0, 5).forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (criado em: ${new Date(user.created_at).toLocaleString('pt-BR')})`);
    });
  }
}

async function checkUserProfiles() {
  console.log('\n🔍 3. VERIFICANDO USER_PROFILES...\n');
  
  const { data, error, count } = await supabase
    .from('user_profiles')
    .select('*, user_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('❌ Tabela user_profiles não existe ou não está acessível');
    console.error('   Erro:', error.message);
    return;
  }
  
  console.log(`Total de perfis: ${count}`);
  
  if (data && data.length > 0) {
    console.log('\nÚltimos perfis criados:');
    console.table(data.map(p => ({
      user_id: p.user_id?.substring(0, 8) + '...',
      display_name: p.display_name,
      level: p.level,
      xp: p.xp_points,
      orders: p.total_orders,
      created: new Date(p.created_at).toLocaleString('pt-BR')
    })));
  }
}

async function checkSync() {
  console.log('\n🔍 4. VERIFICANDO SINCRONIZAÇÃO AUTH <-> PROFILES...\n');
  
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const { count: profilesCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Usuários em auth.users: ${users.length}`);
  console.log(`Perfis em user_profiles: ${profilesCount || 0}`);
  
  if (users.length === profilesCount) {
    console.log('✅ SINCRONIZADO - Todos os usuários têm perfil');
  } else if (users.length > (profilesCount || 0)) {
    console.log('⚠️  DESSINCRONIZADO - Faltam perfis!');
    console.log(`   ${users.length - (profilesCount || 0)} usuários sem perfil`);
  } else {
    console.log('⚠️  INCONSISTENTE - Mais perfis que usuários (dados órfãos)');
  }
}

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  SUPABASE DATABASE VERIFICATION');
  console.log('═══════════════════════════════════════════');
  
  try {
    await checkTables();
    await checkAuthUsers();
    await checkUserProfiles();
    await checkSync();
    
    console.log('\n═══════════════════════════════════════════');
    console.log('✅ VERIFICAÇÃO COMPLETA');
    console.log('═══════════════════════════════════════════\n');
  } catch (err) {
    console.error('\n❌ ERRO NA VERIFICAÇÃO:', err);
    process.exit(1);
  }
}

main();
