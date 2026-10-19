# Little Noor

Little Noor is an Islamic learning website for children aged 3–10. This repository currently holds the starting frontend and a small API shell. Lessons, quizzes, games, and the AI teacher are not built yet.

## Folders

- `frontend` — Vite + React app (JavaScript)
- `backend` — Express API starter with a health check only

No API keys are required, and the frontend does not call an external service.

## Prerequisites

- Node.js 20 or newer (this project was set up with Node 24)

## Install

From the project root, install each app in its own folder:

```powershell
cd frontend
npm install
```

```powershell
cd ..\backend
npm install
```

## Run the frontend

```powershell
cd frontend
npm run dev
```

Vite prints a local address, usually http://localhost:5173.

## Run the backend

Open a second terminal:

```powershell
cd backend
npm run dev
```

The API listens on http://localhost:5000. Check it with http://localhost:5000/api/health.

Set `PORT` before the command if 5000 is already in use.

## Production build

```powershell
cd frontend
npm run build
```

The built files are written to `frontend/dist`. Preview them with `npm run preview`.

The backend has no build step. Use `npm start` in `backend` to run it without file watching.

## Frontend routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/kalimas` | Kalimas |
| `/azkar` | Azkar |
| `/tasbeeh` | Tasbeeh |
| `/quiz` | Quiz |
| `/games` | Games |
| `/ai-teacher` | AI Teacher |
| `/parent` | Parent Dashboard |

Pages other than the home layout are placeholders.
