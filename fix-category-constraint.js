// Temporary script - fix category NOT NULL constraint on Supabase
// Run with: node fix-category-constraint.js

const fs = require('fs');
const path = require('path');

// Read .env.local
const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');

// Parse env vars
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
});

const dbUrl = env['DATABASE_URL'];
if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in .env.local');
  console.log('Available keys:', Object.keys(env).join(', '));
  process.exit(1);
}

console.log('✅ DATABASE_URL found:', dbUrl.replace(/:([^:@]+)@/, ':***@'));

// Use postgres package (already installed in the project)
const postgres = require('postgres');

const sql = postgres(dbUrl, { ssl: { rejectUnauthorized: false } });

async function fix() {
  try {
    console.log('\n🔧 Step 1: Checking current column constraint...');
    const check = await sql`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'category'
    `;
    
    if (check.length === 0) {
      console.log('ℹ️  Column "category" does not exist in products table. No fix needed!');
    } else {
      console.log('Current state:', check[0]);
      
      if (check[0].is_nullable === 'YES') {
        console.log('✅ Column "category" is already nullable. No fix needed!');
      } else {
        console.log('\n🔧 Step 2: Dropping NOT NULL constraint...');
        await sql`ALTER TABLE public.products ALTER COLUMN category DROP NOT NULL`;
        console.log('✅ NOT NULL constraint removed!');
        
        console.log('\n🔧 Step 3: Filling any NULL values...');
        const updated = await sql`
          UPDATE public.products SET category = 'garrafa' WHERE category IS NULL
        `;
        console.log(`✅ Updated ${updated.count} rows with category = 'garrafa'`);
        
        console.log('\n🔧 Step 4: Verification...');
        const verify = await sql`
          SELECT column_name, is_nullable FROM information_schema.columns
          WHERE table_name = 'products' AND column_name = 'category'
        `;
        console.log('✅ Verified:', verify[0]);
        console.log('\n🎉 FIX COMPLETE! Products can now be saved without category.');
      }
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sql.end();
  }
}

fix();
