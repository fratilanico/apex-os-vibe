import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const TEST_EMAIL = 'fratilanico@gmail.com';
const MASTER_ADMIN = 'apex@infoacademy.uk';

async function checkTier() {
  console.log(`Checking tier for: ${TEST_EMAIL}`);

  if (TEST_EMAIL.toLowerCase() === MASTER_ADMIN) {
    console.log('Result: TIER 2 (Master Admin Bypass)');
    return;
  }

  const { data, error } = await supabase
    .from('waitlist')
    .select('status, ai_score')
    .eq('email', TEST_EMAIL)
    .single();

  if (error) {
    console.log('Result: TIER 0 (User not found or DB error)');
    console.error('DB Error:', error.message);
    return;
  }

  console.log(`User Found. Status: ${data.status}, AI Score: ${data.ai_score}`);

  if (['hot', 'warm'].includes(data.status)) {
    console.log('Result: TIER 1 (Waitlist Approved)');
  } else {
    console.log('Result: TIER 0 (Waitlist Cold/Pending)');
  }
}

checkTier();
