import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to database...');

    const updates = fs.readFileSync(path.join(__dirname, '..', 'reset-database.sql'), 'utf8');
    
    console.log('Running migration...');
    await client.query(updates);
    
    console.log('Migration completed successfully!');
    
    // Check if the user exists
    const res = await client.query("SELECT id, email FROM auth.users WHERE email = 'rueliton.andrade@gmail.com'");
    
    if (res.rows.length > 0) {
        console.log('User found:', res.rows[0].email);
        const userId = res.rows[0].id;
        
        console.log('Re-inserting profile for existing admin user...');
        
        // Use a more robust query that handles the conflict
        await client.query(`
            INSERT INTO public.user_profiles (user_id, display_name, role)
            VALUES ($1, $2, 'admin')
            ON CONFLICT (user_id) 
            DO UPDATE SET role = 'admin', display_name = EXCLUDED.display_name;
        `, [userId, 'Rueliton Andrade']);
        
        console.log('Admin profile restored.');
    } else {
        console.log('User rueliton.andrade@gmail.com not found in auth.users. Please sign up again.');
    }

  } catch (err) {
    console.error('Migration failed!', err);
  } finally {
    await client.end();
  }
}

runMigration();
