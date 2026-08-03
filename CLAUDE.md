# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A pixel-art arcade-style quiz game ("像素风闯关问答游戏") built with React + Vite. The frontend is fully static; there is no traditional backend server — Google Apps Script (GAS), deployed as a Web App directly from a Google Sheet, acts as the API and the Sheet itself acts as the database. The UI text and Sheet column headers are in Chinese.

## Commands

```bash
npm install       # install deps
npm run dev       # start Vite dev server (auto-opens browser at localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint       # oxlint (config: .oxlintrc.json — react + oxc plugins)
```

There is no test suite configured in this project.

## Architecture

**Frontend state machine** — `src/App.jsx` owns all app state and switches between three views by string (`'home' | 'quiz' | 'result'`), no router:
- `Home` → collects a user-entered ID and calls `onStart`
- `Quiz` → presents one question at a time, auto-advances 300ms after each answer, and auto-submits after the last question
- `Result` → shows score/pass state and a per-question review

All network calls to the GAS backend happen in `App.jsx` (`startGame`, `submitGame`), not in the child components — `Home`/`Quiz`/`Result` are presentational and receive data + callbacks as props.

**Mock-data fallback**: if `VITE_GOOGLE_APP_SCRIPT_URL` is unset or still contains the placeholder `YOUR_SCRIPT_ID`, `App.jsx` skips the network call and uses hardcoded mock questions/results instead (with an artificial `setTimeout` delay). This lets the UI be developed without a live Google Sheet. Keep this fallback in sync with the real API's response shape when changing either.

**Backend (`apps-script/Code.gs`)** is the single source of truth for the GAS API and is NOT deployed automatically — it must be manually copied into the Apps Script editor attached to the Google Sheet (see README for the full click-through). It exposes one `doPost` entry point dispatching on `action`:
- `getQuestions` — reads the `题目` sheet (columns: 题号/题目/A/B/C/D/解答), Fisher-Yates shuffles, returns `count` questions **without** the 解答 (answer) column
- `submitAnswers` — re-reads `题目` to get correct answers server-side (client never has them), scores the submission, and upserts a row in the `回答` sheet keyed by userId. On first-ever pass for a userId, `第一次通关分数`/`花了几次通关` are set once and never overwritten on subsequent attempts

The frontend and `Code.gs` must be kept in sync manually — there's no shared types/schema between them. When changing the request/response shape of `getQuestions`/`submitAnswers`, update both `App.jsx`'s mock fallback and `Code.gs`.

Requests to GAS are sent as `POST` with `Content-Type: text/plain;charset=utf-8` (not `application/json`) specifically to avoid CORS preflight, since GAS Web Apps don't handle `OPTIONS` well.

**Boss images**: pulled from the DiceBear pixel-art API (`api.dicebear.com`) with random seeds, preloaded on mount in `App.jsx`, one per question slot (cycled via `index % bossImages.length` in `Quiz.jsx`).

## Environment variables

Configured via `.env` (gitignored; see `.env.example`), consumed with `import.meta.env.VITE_*`:
- `VITE_GOOGLE_APP_SCRIPT_URL` — the GAS Web App `/exec` URL
- `VITE_PASS_THRESHOLD` — number of correct answers required to pass
- `VITE_QUESTION_COUNT` — number of questions pulled per game

In CI (`.github/workflows/deploy.yml`), these same three are injected as GitHub Actions secrets at build time, since the static build bakes env vars in.

## Deployment

Pushing to `main` or `master` triggers `.github/workflows/deploy.yml`, which builds with the injected secrets and publishes `dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`. GitHub Pages must be configured to serve from the `gh-pages` branch (root) — see README section 5 for the one-time setup. `vite.config.js` uses `base: './'` (relative paths) so the build works when served from a repo subpath.

Changes to `apps-script/Code.gs` are **not** picked up by this pipeline — they must be manually re-pasted into the Apps Script editor and redeployed as a new Web App version.
