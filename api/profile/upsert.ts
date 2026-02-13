import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, trajectory, name, phone, client_session_id } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const now = new Date().toISOString();
    const updateData: any = {
      email,
      updated_at: now,
    };

    if (trajectory) {
      updateData.trajectory = trajectory;
      updateData.trajectory_selected_at = now;
    }
    if (name) updateData.full_name = name;
    if (phone) updateData.phone = phone;
    if (client_session_id) updateData.client_session_id = client_session_id;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(updateData, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ profile: data });
  } catch (error: any) {
    console.error('[API] upsert_profile error:', error);
    return res.status(500).json({ error: error.message });
  }
}
