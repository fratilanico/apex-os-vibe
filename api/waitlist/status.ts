import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email required' });
  }

  if (!supabase) {
    return res.status(200).json({ exists: false, message: 'Supabase not configured' });
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('name, profile_type, referral_code')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return res.status(200).json({ exists: false });
    }

    return res.status(200).json({ 
      exists: true, 
      name: data.name,
      persona: data.profile_type,
      referral_code: data.referral_code
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
