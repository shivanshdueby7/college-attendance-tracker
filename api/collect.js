// POST /api/collect — anonymous install heartbeat (no auth; payload validated).
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (server only, never shipped to clients).
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return res.status(501).json({ ok: false, error: 'telemetry not configured' });
  const b = req.body || {};
  const id = String(b.id || '');
  const platform = b.platform === 'android' ? 'android' : 'web';
  const subjects = Math.max(0, Math.min(1000, Math.floor(+b.subjects || 0)));
  const marks = Math.max(0, Math.min(1000000, Math.floor(+b.marks || 0)));
  const v = Math.max(1, Math.min(999, Math.floor(+b.v || 1)));
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return res.status(400).json({ ok: false });
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/heartbeats`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: 'Bearer ' + SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ install_id: id, platform, app_version: v, subjects, marks, last_seen: new Date().toISOString() }),
    });
    if (!r.ok) throw new Error('db ' + r.status);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
