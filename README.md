# Task Manager Server

## Overview
Node.js/Express backend for the Task Manager app. It provides user authentication and task CRUD APIs with encrypted task descriptions and cookie-based JWT auth.

## Features
- User registration, login, logout
- JWT auth stored in HTTP-only cookies
- Task CRUD (create, list, update, delete)
- Pagination, status filtering, and search
- AES-256-GCM encryption for task descriptions at rest

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Joi for validation
- JWT for authentication
- Bcrypt for password hashing

## Requirements
- Node.js (LTS recommended)
- MongoDB instance

## Setup
```bash
npm install
```

## Environment Variables
Create `server/.env` with the following values:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=32_character_secret_key_here
CLIENT_URL=http://localhost:5173
```

Notes:
- `ENCRYPTION_KEY` must be exactly 32 characters.
- Cookies are configured for cross-site use in production; set `CLIENT_URL` to the frontend origin.

## Run in Development
```bash
npm run dev
```

## Run in Production
```bash
npm start
```

## API Base
All routes are served under:
```
http://localhost:5000/api
```

## Endpoints
Auth:
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`
- POST `/auth/logout`

Tasks (auth required):
- GET `/tasks` (supports `page`, `limit`, `status`, `search`)
- POST `/tasks`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`

## Project Structure
```
server/
  src/
    config/         Database connection
    controllers/    Request handlers
    middleware/     Auth and validation
    models/         Mongoose schemas
    routes/         API routes
    utils/          Crypto helpers
    validators/     Joi schemas
```

## Notes
- Auth uses HTTP-only cookies named `token`.
- If `MONGODB_URI` is missing, the server exits with an error.
- Task descriptions are encrypted before storage and decrypted on read.
