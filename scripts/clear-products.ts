import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://elgomlavjxzzszdjumyx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZ29tbGF2anh6enN6ZGp1bXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUwMzAyNiwiZXhwIjoyMDg0MDc5MDI2fQ.WXEfqm01wMrFuKBfs1F7KNyqCg0w1t1AVy7hk5gaI6Y"; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  }
});

async function clearProducts() {
  console.log("Deleting all products...");
  
  // Delete all rows from 'products'
  // Needing a condition wrapper because delete() without filter is blocked sometimes, 
  // but usually neq id '0' works as 'all'.
  const { error } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error("Error deleting products:", error);
  } else {
    console.log("All products deleted successfully.");
  }
}

clearProducts();
