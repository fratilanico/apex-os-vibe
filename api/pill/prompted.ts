import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ 
        email, 
        trajectory_prompted_at: now,
        updated_at: now 
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ profile: data });
  } catch (error: any) {
    console.error('[API] pill_prompted error:', error);
    return res.status(500).json({ error: error.message });
  }
}
