# Kanban Learning Board

A Kanban-based **Self-Regulated Learning (SRL)** tool for university students. Instead of a generic To Do / Doing / Done board, each column maps to a phase of the SRL cycle, so the board itself nudges students through planning, monitoring, and reflecting on their own learning — not just tracking tasks.

**[Live demo](#) · [Try it with zero setup](#try-it-with-zero-setup-demo-mode)**

## What is Self-Regulated Learning?

Self-regulated learning is a cyclical process where learners plan their approach to a task, monitor and control their progress while working on it, and reflect on the outcome afterward. This board's four columns are that cycle, made visible:

| Column | SRL Phase | What goes here |
|---|---|---|
| **Planning (To Do)** | Forethought | New material a student intends to study — pick a course, set a difficulty, choose a learning strategy up front. |
| **Monitoring (In Progress)** | Performance monitoring | Material actively being studied — track time spent with the built-in study timer, log a pre-test grade. |
| **Controlling (Review)** | Performance control | Material under review — add notes/summaries, adjust strategy if it isn't working, record a post-test grade. |
| **Reflection (Done)** | Self-reflection | Completed material — rate how well it was understood, with the full grade history and time-per-column visible. |

Every card carries a learning strategy (rehearsal, elaboration, organization, metacognitive self-regulation, time management, help-seeking, etc.), a priority and difficulty, and a full history of which columns it passed through and when — which is what feeds the analytics dashboard (task distribution, top strategies, pre/post-test performance per course, most active courses).

## Features

- **Personal Kanban board** — drag-and-drop cards across the four SRL columns, with a built-in study timer per card, checklists, links, notes, and pre/post-test grade tracking.
- **Learning analytics dashboard** — doughnut chart of task distribution, bar charts for top strategies, course performance (pre vs. post-test), and most active courses, computed live from the student's own board.
- **Admin panel** — manage the course catalog and learning strategy list, browse any student's board and their card movement history, and review system (login/logout) logs.
- **Demo mode** — the entire app runs with zero backend, see below.

<!-- Screenshots -->
<!-- ![Kanban board](docs/screenshots/board.png) -->
<!-- ![Analytics dashboard](docs/screenshots/analytics.png) -->
<!-- ![Admin panel](docs/screenshots/admin.png) -->

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 15 (Pages Router), React 18, TypeScript |
| Styling / UI | Tailwind CSS, shadcn/ui (Radix primitives), Framer Motion |
| Drag & drop | react-beautiful-dnd |
| Charts | Chart.js (via react-chartjs-2) |
| Backend | Flask (Python), Flask-JWT-Extended, Flask-CORS |
| Database | MongoDB (via PyMongo / Flask-PyMongo) |
| Auth | JWT access tokens + HttpOnly refresh cookie |
| Deployment | Vercel (frontend), any Python host (backend) |

## Try it with zero setup (demo mode)

The whole app — student board, admin panel, and analytics — runs standalone with no backend, no database, and no account. All API calls are swapped for `localStorage`-backed mock data (see `frontend/lib/demo/`), so it's safe to deploy the frontend on its own (e.g. to Vercel) purely as a demo.

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_DEMO_MODE=true" > .env.local
npm run dev
```

Open `http://localhost:3000/demo` and pick **Try as Student** or **Try as Admin**. Everything you do — moving cards, filling in grades, editing courses and strategies — persists in your browser for the session; a "Reset Demo Data" button (in the demo banner) clears it and re-seeds.

That's the only configuration demo mode needs. No `MONGO_URI`, no Flask server, nothing else to run.

## Local development (full stack, real backend)

### Backend (`backend/`)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create `backend/.env`:

```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET_KEY=<any random secret>
```

Then run:

```bash
python app.py
```

The API listens on `http://localhost:5000` by default.

### Frontend (`frontend/`)

```bash
cd frontend
npm install
```

Create `frontend/.env.local` (see `.env.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEMO_MODE=false
```

```bash
npm run dev
```

Open `http://localhost:3000` — register an account (or use an existing one) and log in.

## Project structure

```
self-regulated-learning/
├── backend/          # Flask REST API
│   ├── controllers/  # request handlers
│   ├── models/       # MongoDB document access
│   ├── routes/       # Flask blueprints
│   └── utils/        # auth/db helpers
└── frontend/         # Next.js app
    ├── pages/         # routes (Pages Router)
    ├── components/    # kanban/, analytics/, admin/, ui/ primitives
    ├── hooks/         # useBoard, useAuth, useCardDetail, useAnalytics
    ├── lib/
    │   ├── api/       # real API client, one module per domain
    │   └── demo/      # demo-mode mock API + seed data
    └── types/         # shared TypeScript interfaces
```
