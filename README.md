# FlowForge

Full-stack project management platform.

## Stack

Frontend:
- React
- TypeScript
- Vite
- React Router
- Axios

Backend:
- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- Zod

Data:
- PostgreSQL
- Prisma
- Redis

## Core features

- Authentication
- JWT sessions
- Protected routes
- Organizations
- Organization members
- Projects
- Tasks
- Comments
- Profile
- Settings

## Local development

Backend:
`cd backend`
`npm run dev`

Frontend:
`cd frontend`
`npm run dev`

## Production

Frontend requires `VITE_API_URL`.

Backend requires:
- DATABASE_URL
- JWT_SECRET
- REDIS_URL
- PORT
