# Sportline API

REST API for managing clients, products, and deliveries (with stock validation), plus authentication. Built with Express + Sequelize (PostgreSQL), TypeScript, Jest, and Swagger.

## Stack
- Node.js, Express 5
- TypeScript
- Sequelize (PostgreSQL)
- JWT auth
- Jest (unit tests)
- Swagger UI (OpenAPI 3)
- Docker + docker-compose

---

## 1) Run locally (no Docker)

Step 1 — Install dependencies
- npm install

Step 2 — Configure environment
Create a .env in the project root (optional if you use defaults).
Example:
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=perla
DB_NAME=sportslinedb
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
```

Step 3 — Start PostgreSQL
- Option A: Use a local PostgreSQL and ensure the DB/credentials exist
- Option B: Start a throwaway Postgres in Docker:
```
docker run --name sportline_db -e POSTGRES_PASSWORD=perla -e POSTGRES_DB=sportslinedb -p 5432:5432 -d postgres:16
```

Step 4 — Start the API (dev mode)
- npm run dev
- API: http://localhost:4000
- Swagger UI: http://localhost:4000/api/docs

Step 5 — (Optional) Seed sample data
- Development (TS): npm run seed
- Production build (JS): npm run build && npm run seed:prod

Step 6 — Run tests
- npm run test

Useful notes
- The server syncs DB schema on startup (sequelize.sync({ alter: true })). For production, prefer migrations.
- Delivery creation is transactional; stock is validated and decremented atomically.

---

## 2) Run with Docker (app + db)

The included docker-compose.yml will build and run the API and a Postgres database. It also supports running the seeder automatically on first start.

Step 1 — Build and start
- docker-compose up --build

Step 2 — Access
- API: http://localhost:4000
- Swagger: http://localhost:4000/api/docs

Step 3 — Stop
- docker-compose down

Environment used by compose (see docker-compose.yml)
- DB_HOST=db
- DB_PORT=5432
- DB_USER=postgres
- DB_PASSWORD=example
- DB_NAME=sportlinedb
- JWT_ACCESS_SECRET and JWT_REFRESH_SECRET (replace with strong values)
- RUN_SEEDER=true (runs seeder on container start)

Adjusting seeding
- To skip seeding, set RUN_SEEDER to "false" or remove it from the app service env.

Tip: If you change DB_* or JWT_* values in compose, ensure they match your expectations in the app and any external clients.

---

## Scripts
- Dev server: npm run dev
- Build (tsc): npm run build
- Start (from dist): npm start
- Seed (TS): npm run seed
- Seed (JS from dist): npm run seed:prod
- Tests (Jest + coverage): npm run test
- Test watch: npm run test:watch

---

## API quick reference
- Auth: POST /api/auth/register, /login, /refresh
- Clients: GET/POST /api/clients, GET/PUT/DELETE /api/clients/:id
- Products: GET/POST /api/products, GET/PUT/DELETE /api/products/:id, GET /api/products/code/:code
- Deliveries: POST /api/deliveries (validates stock), GET /api/deliveries/client/:clientId/history

Swagger
- UI: http://localhost:4000/api/docs
- Spec JSON: http://localhost:4000/api/docs.json

---

## Sample requests
- Create delivery
```
{"clientId":1,"notes":"Order 123","items":[{"productId":10,"quantity":2},{"productId":12,"quantity":1}]}
```

---

## Project structure (high-level)
- src/
  - app.ts (Express bootstrap and route mounting)
  - config/db.ts (Sequelize config, uses env DB_*)
  - models/ (Sequelize models)
  - dao/ (Data access layer)
  - services/ (Business logic)
  - controllers/ (Route handlers)
  - routes/ (Express routers)
  - middleware/ (validation, auth)
  - dtos/ (types)
  - utils/ (hash, jwt, validation)
  - docs/swagger.ts (OpenAPI spec)
  - seeders/seeder.ts (sample data)
- tests/ (Jest unit tests)

---

## Production notes
- Set strong JWT secrets (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET).
- Consider disabling sequelize.sync in production and use migrations.
- Configure proper logging and monitoring.
