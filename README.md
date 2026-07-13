# Fullstack learnings project

Backend: Express + Prisma + PostgreSQL app \
Frontend: NextJS + React + TailwindCSS

## Installation

```
docker compose up -d

cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate dev

cd ..

cd frontend
npm install
```

## Start

In separate terminals run these commands \
Backend: To run Backend API service `npm run dev` (inside backend folder) \
Backend: To view database run `npx prisma studio` (inside backend folder) \
Frontend: To open app `npm run dev` (inside frontend folder)
