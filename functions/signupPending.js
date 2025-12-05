// netlify/functions/signup-pending.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  const { email, password, username, role } = body;

  /* ---------- 1. Check REAL users ---------- */
  const { data: realUserByEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  
  if (realUserByEmail) {
    return res.status(400).json({ error: 'Email already registered.' });
  }

  const { data: realUserByUsername } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  
  if (realUserByUsername) {
    return res.status(400).json({ error: 'Username already taken.' });
  }

  /* ---------- 2. Check pending_users ---------- */
  const { data: pendingByEmail } = await supabase
    .from('pending_users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (pendingByEmail) {
    return res.status(400).json({ error: 'Email waiting for verification.' });
  }

  const { data: pendingByUsername } = await supabase
    .from('pending_users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (pendingByUsername) {
    return res.status(400).json({ error: 'Username waiting for verification.' });
  }

  /* ---------- 3. Generate OTP ---------- */
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();


  /* ---------- 4. Insert pending user ---------- */
  await supabase.from('pending_users').insert([{
    email,
    username,
    password_hash: password,
    role,
    otp_code: otp,
    otp_expires_at: expires
  }]);

  /* ---------- 5. Send OTP e-mail ---------- */
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "MyApp <no-reply@myapp.com>",
      to: email,
      subject: "Verification Code",
      html: `<p>Your OTP is <strong>${otp}</strong></p>`
    })
  });

  return res.json({ ok: true });
}