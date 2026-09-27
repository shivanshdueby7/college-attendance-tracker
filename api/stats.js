// GET /api/stats — admin dashboard data. Requires: Authorization: Bearer <ADMIN_TOKEN>.
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_TOKEN (all server-only).
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_TOKEN } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ADMIN_TOKEN) return res.status(501).json({ ok: false, error: 'stats not configured' });
  if (req.headers.authorization !== 'Bearer ' + ADMIN_TOKEN) return res.status(401).json({ ok: false });
  try {
    const H = { apikey: SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + SUPABASE_SERVICE_KEY };
    const q = await fetch(`${SUPABASE_URL}/rest/v1/heartbeats?select=install_id,platform,app_version,subjects,marks,first_seen,last_seen&order=last_seen.desc&limit=10000`, { headers: H });
    if (!q.ok) throw new Error('db ' + q.status);
    const rows = await q.json();
    const now = Date.now(), d = 864e5;
    const active = n => rows.filter(r => now - new Date(r.last_seen).getTime() < n * d).length;
    const plat = {}, ver = {};
    let subSum = 0, markSum = 0;
    for (const r of rows) {
      plat[r.platform] = (plat[r.platform] || 0) + 1;
      ver['v' + r.app_version] = (ver['v' + r.app_version] || 0) + 1;
      subSum += +r.subjects || 0; markSum += +r.marks || 0;
    }
    return res.status(200).json({
      ok: true,
      total: rows.length,
      active7: active(7), active30: active(30),
      avgSubjects: rows.length ? +(subSum / rows.length).toFixed(1) : 0,
      totalMarks: markSum,
      platforms: plat, versions: ver,
      recent: rows.slice(0, 50).map(r => ({
        id: String(r.install_id).slice(0, 8) + '…',
        platform: r.platform, v: r.app_version,
        subjects: r.subjects, marks: r.marks, last: r.last_seen,
      })),
    });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
