## Interview-ready AI App

A full-stack web app to help users prepare for technical interviews using AI-powered question generation, practice sessions, and user session management. This repository contains a TypeScript/Node backend and a React + Vite frontend.

![App Screenshot](./docs/app-screenshot.png)

> Replace `./docs/app-screenshot.png` with your app screenshot. You can paste an image into `docs/` and keep the same filename.

## Table of contents

-   Project overview
-   Features
-   Architecture
-   Routes (high-level)
-   Environment variables
-   Setup & run
-   Contributing
-   Where to look in the code

## Project overview

This project helps users prepare for technical interviews by:

-   Managing users and authentication
-   Creating and storing interview questions
-   Creating practice sessions (timed/mock interviews)
-   Generating AI-driven question suggestions and answer previews

The repository is split into two main folders:

-   `backend/` — TypeScript Node server (API, DB models, controllers, services)
-   `frontend/` — React + Vite app (UI, pages, components)

## Features

-   User authentication (signup, login, protected routes)
-   CRUD for questions (create, read, update, delete)
-   Create and manage interview practice sessions
-   AI-powered assistance (question generation / response previews)
-   File upload support (profile pictures or session attachments)
-   Middlewares: request logging, auth checking, error handling

## Architecture

-   Backend: Express (TypeScript), controllers -> services -> models, with a utilities folder for common helpers and error handling.
-   Frontend: React + TypeScript (Vite) with a component-based structure. Pages for Landing, Auth, Dashboard, and Interview Prep.

## Routes (high-level)

The backend exposes a set of route groups. See `backend/src/routes/` for the exact implementations. Typical endpoints by group include:

-   /api/auth

    -   POST /signup — create a new user
    -   POST /login — login and receive a JWT
    -   GET /me — get current user (protected)

-   /api/questions

    -   GET / — list questions
    -   POST / — create a question (protected)
    -   GET /:id — get question details
    -   PUT /:id — update a question (protected)
    -   DELETE /:id — delete a question (protected)

-   /api/sessions
    -   GET / — list practice sessions (user-specific)
    -   POST / — create a practice session (protected)
    -   GET /:id — session details
    -   PUT /:id — update session
    -   DELETE /:id — remove session

There is also an AI-related controller/service used to generate question prompts and AI responses (see `backend/src/controllers/aiController.ts` and `backend/src/services/aiService.ts`). The AI endpoints may be embedded in other route groups or exposed under a dedicated path (inspect `src/routes` for exact paths).

Note: The above list is a high-level overview. For exact route signatures and request/response shapes, open the corresponding files in `backend/src/routes` and `backend/src/controllers`.

## Environment variables

Put environment variables in `backend/.env` (do not commit secrets). The code expects some common variables; verify exact names in `backend/src/utils/env.ts`. Typical variables used by this project:

-   MONGO_URI — MongoDB connection string
-   PORT — server port (e.g. 4000)
-   JWT_SECRET — secret used to sign JSON Web Tokens
-   NODE_ENV — development | production
-   OPENAI_API_KEY — (if AI service uses OpenAI)
-   CLOUDINARY*URL or CLOUDINARY*\* — (if uploads use Cloudinary)

## Setup & run

Quick start — run backend and frontend in two terminals.

1. Backend

```bash
cd backend
npm install
# Check package.json for the dev/start scripts (e.g. "dev" runs ts-node-dev or nodemon)
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
# Open the URL shown by Vite (usually http://localhost:5173)
```

Notes:

-   If `npm run dev` doesn't exist for either package, inspect `package.json` for the appropriate start command (e.g. `start`, `serve`, `build`).
-   Ensure the backend `PORT` and frontend API base URL (if configured) match or set the frontend to proxy the backend.

## Development tips

-   Backend API files to inspect and modify:

    -   `backend/src/index.ts` — server entry
    -   `backend/src/routes/*` — route registration
    -   `backend/src/controllers/*` — request handlers
    -   `backend/src/services/*` — business logic
    -   `backend/src/models/*` — Mongoose models

-   Frontend files to inspect and modify:
    -   `frontend/src/main.tsx` and `frontend/src/App.tsx` — app entry and routing
    -   `frontend/src/pages/*` — page components
    -   `frontend/src/components/*` — UI components
    -   `frontend/src/utils/axios.ts` — central axios instance (adjust baseURL if needed)

## Where to look for exact API details

-   Exact route handlers and HTTP methods: `backend/src/routes/`
-   Request/response shapes: `backend/src/controllers/` and `backend/src/types`
-   Auth middleware and token generation: `backend/src/middlewares/authMiddleware.ts` and `backend/src/utils/generateToken.ts`

## Contributing

-   Fork the repo and open a PR with a clear description.
-   Keep API changes backward-compatible or document breaking changes.
