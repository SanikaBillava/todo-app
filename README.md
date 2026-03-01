# MERN Todo Application

A full-stack to-do app built with **MongoDB**, **Express**, **React**, and **Node.js**.

## Features

- **Login**: Enter a username to sign in (user is created if new). Each login is recorded with a timestamp.
- **Dashboard**: View total login count and last login time.
- **Tasks**: Add tasks with priority (High, Medium, Low). Filter by All, Pending, or Completed. Toggle completion and delete tasks.

## Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a connection string in `.env`

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file (optional):

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todo-app
FRONTEND_URL=http://localhost:3000
```

Start the server:

```bash
npm start
```

Server runs at **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**. The Vite dev server proxies `/api` to the backend.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Body: `{ "username": "string" }`. Find or create user, append current time to `loginHistory`. Returns user. |
| GET | `/api/todos/:userId` | Get all todos for user, sorted by priority (1 first). |
| POST | `/api/todos` | Body: `{ "userId", "text", "priority" }`. Create todo. |
| PUT | `/api/todos/:id` | Body: `{ "text"?, "priority"?, "completed"? }`. Update todo. |
| DELETE | `/api/todos/:id` | Delete todo. |

## Deploy on Vercel

The app is set up for **Vercel**: frontend is built as a static site and the API runs as serverless functions.

### 1. MongoDB Atlas (required for production)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and note the password.
3. In **Network Access**, add `0.0.0.0/0` (allow from anywhere) so Vercel can connect.
4. In **Database** → **Connect** → **Drivers**, copy the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/todo-app?retryWrites=true&w=majority`).

### 2. Deploy to Vercel

1. Push the project to **GitHub** (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** and import the repo.
3. Leave **Root Directory** as `.` and **Framework Preset** as **Other** (or **Vite** if you prefer; build settings below override).
4. **Environment variables** (Project Settings → Environment Variables):
   - `MONGODB_URI` = your Atlas connection string (replace `<password>` with the real password).
   - Optionally `FRONTEND_URL` = your Vercel URL (e.g. `https://your-project.vercel.app`) for CORS; same-origin deployment often works without it.
5. **Build & development settings** (or use the project’s `vercel.json`):
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install` (installs root/backend deps for the API).
6. Click **Deploy**.

The site will be at `https://your-project.vercel.app`. The same app serves the React UI and `/api/*` (login, todos) from one deployment.

### Local development after adding Vercel

- Backend: `cd backend && npm start` (uses local MongoDB or `.env`).
- Frontend: `cd frontend && npm run dev` (proxies `/api` to localhost:5000).

---

## Tech Stack

- **Backend**: Node.js, Express, Mongoose
- **Frontend**: React 18, Vite
- **Database**: MongoDB
