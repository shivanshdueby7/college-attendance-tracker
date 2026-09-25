# Attendance Ledger

Single-file offline college attendance tracker + bunk planner. No build, no login, data in `localStorage ledger_v1`.

## Run locally

Just open `index.html` in a browser.

## Deploy (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USER/attendance-ledger)

Or via CLI:

```bash
npx vercel --prod
```

## Features

- Manual per-day per-class marking (Present / Absent / Cancelled)
- Subjects with per-subject targets + prior counts
- Weekly timetable, holidays + weekly offs (excluded from maths)
- Safe-bunk / must-attend engine, bunk planner with projection
- Month heatmap, SVG pies + bars, ledger table
- CSV / copy summary / JSON backup + restore, dark theme
