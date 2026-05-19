# DevBoard

A full-stack developer productivity tool for tracking tasks and pull requests across GitHub repositories.

## Features

- **GitHub OAuth** — secure login via GitHub, no passwords stored
- **Kanban Board** — drag-and-drop task management across To Do / In Progress / Done
- **Repository Sync** — pulls all your GitHub repos via the GitHub API
- **PR Tracker** — view open and closed pull requests per repository
- **PostgreSQL backend** — fully normalized relational schema across users, repos, tasks, and PRs
- **REST API** — Express.js backend with session-based auth and protected routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | GitHub OAuth 2.0, Passport.js, express-session |
| API | GitHub REST API (repos, pull requests) |
| Deployment | Vercel (frontend), Railway (backend) |

## Database Schema

- users — GitHub profile, stored access token
- repositories — synced GitHub repos per user
- tasks — Kanban tasks with priority, status, repo link
- pull_requests — PR state synced from GitHub API

## Local Setup

1. Clone: git clone https://github.com/saumyg3/devboard.git
2. cd backend && npm install
3. Create backend/.env with your GitHub OAuth credentials
4. createdb devboard && psql devboard < backend/src/db/schema.sql
5. npm run dev
6. cd ../frontend && npm install && npm run dev

## GitHub OAuth Setup

1. Go to github.com/settings/developers, OAuth Apps, New OAuth App
2. Set callback URL to http://localhost:3001/auth/github/callback
3. Copy Client ID and Secret into your .env
