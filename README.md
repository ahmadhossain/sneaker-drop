# Sneaker Drop

A full-stack real-time inventory system for limited edition sneaker drops with live stock tracking, timed reservations, and concurrent purchase handling.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Neon serverless)
- **Real-time:** Socket.io
- **ORM:** Sequelize

### Concurrency Strategy

Stock is protected via atomic PostgreSQL operations:

```sql
-- Only 1 of N concurrent requests succeeds for the last item
UPDATE drops SET stock = stock - 1
WHERE id = $1 AND stock > 0
RETURNING id, stock;
```

PostgreSQL acquires an exclusive row-level lock. The first request decrements stock; subsequent requests see `stock = 0` and fail gracefully. A `CHECK (stock >= 0)` constraint serves as a safety net.

### Reservation Flow

1. **Reserve** — stock decremented, 60-second timer starts
2. **Purchase** — reservation marked as purchased (stock unchanged, already decremented)
3. **Expire** — if 60s passes without purchase, stock is returned via `setTimeout`

Race conditions between purchase and expiration are handled with `SELECT ... FOR UPDATE` on the reservation row.

## Setup

### 1. Database

Create a PostgreSQL database on [Neon](https://neon.tech) and copy the connection URL.

### 2. Server

```bash
cd server
cp .env.example .env
# Edit .env — set DATABASE_URL to your Neon connection string
# DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/dbname?sslmode=require
npm install
npm run dev
```

The server will:

- Sync the database schema
- Seed 20 users (idempotent)
- Clean up any orphaned reservations
- Log the user table to console (copy a userId from here)
- Listen on port 3001

### 3. Client

```bash
cd client
npm install
npm run dev
```

The client runs on port 5173 with a Vite proxy to the server.

### 4. Open the App

```
http://localhost:5173?userId=<paste-a-user-id-from-server-logs>
```
