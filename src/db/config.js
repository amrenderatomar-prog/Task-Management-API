import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test database connection
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('Supabase connection failed:', error.message);
      return false;
    }
    console.log('Supabase connected successfully!');
    return true;
  } catch (err) {
    console.log('Supabase connection error:', err.message);
    return false;
  }
};

