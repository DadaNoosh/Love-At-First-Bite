# Love At First Bite – Ops

Internal weekly produce operations MVP built with Next.js, Prisma, and Postgres.

## Setup
1. Copy `.env.example` to `.env` and set values.
2. Install dependencies: `npm install`
3. Run migrations: `npx prisma migrate deploy`
4. Seed sample data: `npm run prisma:seed`
5. Run app: `npm run dev`

## Deploy (Vercel)
1. Push to Git provider.
2. Import project in Vercel.
3. Set env vars: `DATABASE_URL`, `AUTH_SECRET`, `APP_PASSWORD`.
4. Build command: `npm run build`.

## Workflow test plan
- Create/open current week
- Add PLAN line
- Enter ORDER qty + price and mark ordered
- Enter RECEIVED qty and final cost
- Enter STOCK values (takings + closing stock)
- Check dashboard financial tiles and month/quarter/year rollups
