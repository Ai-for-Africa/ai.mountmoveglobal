const { createClient } = require('@supabase/supabase-js') as any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase instance (uses anon/publishable key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance with service role key (bypasses RLS — server only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const RECEIPT_BUCKET = 'bank-transfer-receipts';