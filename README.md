# MERN Todo Application

A full-stack to-do app built with **MongoDB**, **Express**, **React**, and **Node.js**. Users sign in with a username, track login history, and manage tasks with priorities and filters. The API is deployed as serverless functions on Vercel alongside the React frontend.

**Live app:** https://todo-app-mern-pi.vercel.app · **Source code:** https://github.com/SanikaBillava/todo-app

---

## Features

- **User login** — Sign in with a username (find-or-create). Each login is stored with a timestamp in MongoDB.
- **Dashboard** — Shows total login count and last login time per user.
- **Tasks** — Add tasks with priority (High, Medium, Low). Filter by All, Pending, or Completed. Toggle completion and delete tasks.
- **Responsive UI** — Clean, responsive layout with a dark theme.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Find or create user by username; append current timestamp to `loginHistory`. |
| GET | `/api/todos/:userId` | Get user's tasks sorted by priority. |
| POST | `/api/todos` | Create a task (text, priority, userId). |
| PUT | `/api/todos/:id` | Update task (text, priority, completed). |
| DELETE | `/api/todos/:id` | Delete a task. |

---

## Tech Stack

- **Backend:** Node.js, Express, Mongoose  
- **Frontend:** React 18, Vite  
- **Database:** MongoDB (MongoDB Atlas in production)  
- **Hosting:** Vercel (frontend + serverless API)
