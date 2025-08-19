# ByteBusters
Collaborative Digital Ecosystem for Inclusive Health and Well-Being 


Flowchart: Collaborator GitHub Workflow

           ┌────────────────────────┐
           │   Original Repository   │
           │ (Upstream on GitHub)    │
           └───────────┬────────────┘
                       │
             ┌─────────▼─────────┐
             │ 1. Fork the Repo   │
             │ (Your GitHub copy) │
             └─────────┬─────────┘
                       │
             ┌─────────▼───────────┐
             │ 2. Clone to Local PC │
             │ git clone <fork-url> │
             └─────────┬───────────┘
                       │
             ┌─────────▼───────────┐
             │ 3. Make Changes      │
             │ Edit/Add/Remove code │
             └─────────┬───────────┘
                       │
             ┌─────────▼──────────┐
             │ 4. Commit Changes   │
             │ git add .           │
             │ git commit -m "msg" │
             └─────────┬──────────┘
                       │
             ┌─────────▼──────────┐
             │ 5. Push to Fork     │
             │ git push origin main│
             └─────────┬──────────┘
                       │
             ┌─────────▼──────────┐
             │ 6. Create Pull Req  │
             │ (From fork → orig)  │
             └─────────┬──────────┘
                       │
             ┌─────────▼──────────┐
             │ 7. Upstream Merges  │
             │ Maintainer reviews  │
             │ & merges PR         │
             └─────────┬──────────┘
                       │
             ┌─────────▼──────────┐
             │ 8. Sync Your Fork   │
             │ git pull upstream   │
             │ main                │
             └─────────────────────┘

Quickstart (Local)

1) Prerequisites
   - Node.js 18+
   - MongoDB running locally (default URIs used)

2) Start NGO backend (auth APIs at http://localhost:5000)
   - cd ByteBusters/ngo-backend
   - npm install
   - npm run dev

3) Start User API (feedback APIs at http://localhost:5001)
   - cd ByteBusters/user_frontend
   - npm install
   - npm run dev

4) Open the frontends directly in your browser
   - NGO UI: `ByteBusters/frontend_ngo/index1.html` (then login/register)
   - User UI: `ByteBusters/user_frontend/index.html` and `feedback.html`

Notes
- NGO frontend calls POST `http://localhost:5000/auth/register` and `http://localhost:5000/auth/login`
- User feedback page calls `http://localhost:5001/api/feedback` (GET/POST)
- Set env vars `MONGODB_URI`, `JWT_SECRET` as needed