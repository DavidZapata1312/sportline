# 🏋️‍♂️ Sportline API

A clean and modular **REST API** for managing clients, products, and deliveries — including **stock validation** and **JWT authentication**.  
Built with **Express**, **Sequelize (PostgreSQL)**, **TypeScript**, **Jest**, and **Swagger**.

---

## ⚙️ Tech Stack

- **Node.js + Express 5**
- **TypeScript**
- **Sequelize ORM** (PostgreSQL)
- **JWT Authentication**
- **Jest** (unit testing)
- **Swagger UI** (OpenAPI 3)
- **Docker + Docker Compose**

---

## 🚀 1) Run Locally (No Docker)

### 🧩 Step 1 — Install dependencies
```bash
npm install
```

### ⚙️ Step 2 — Configure environment
Create a `.env` file in the project root (optional if you use defaults):

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=perla
DB_NAME=sportslinedb
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
```

### 🐘 Step 3 — Start PostgreSQL
**Option A:** Use your local PostgreSQL  
**Option B:** Run a temporary PostgreSQL container:
```bash
docker run --name sportline_db   -e POSTGRES_PASSWORD=perla   -e POSTGRES_DB=sportslinedb   -p 5432:5432 -d postgres:16
```

### ▶️ Step 4 — Start the API (dev mode)
```bash
npm run dev
```

- API: [http://localhost:4000](http://localhost:4000)  
- Swagger UI: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### 🌱 Step 5 — (Optional) Seed sample data
- Development (TS):  
  ```bash
  npm run seed
  ```
- Production build (JS):  
  ```bash
  npm run build && npm run seed:prod
  ```

### 🧪 Step 6 — Run tests
```bash
npm run test
```

> 📝 **Note:** The server runs `sequelize.sync({ alter: true })` on startup.  
> For production, **migrations are strongly recommended**.

> ✅ Deliveries are handled transactionally — stock validation and decrements occur atomically.

---

## 🐳 2) Run with Docker (API + Database)

The included **docker-compose.yml** spins up both the API and a PostgreSQL instance.  
It can also run the seeder automatically on first boot.

### 🏗 Step 1 — Build and start
```bash
docker-compose up --build
```

### 🌐 Step 2 — Access the services
- **API:** [http://localhost:4000](http://localhost:4000)
- **Swagger UI:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

### 🛑 Step 3 — Stop containers
```bash
docker-compose down
```

### ⚙️ Environment (used by docker-compose)
```env
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=example
DB_NAME=sportlinedb
JWT_ACCESS_SECRET=your-strong-secret
JWT_REFRESH_SECRET=your-strong-secret
RUN_SEEDER=true
```

> 🔧 To disable seeding, set `RUN_SEEDER=false` or remove it from the app service env.

💡 **Tip:** If you modify DB_* or JWT_* values, ensure they match your app configuration and client settings.

---

## 📜 Available Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript (→ dist) |
| `npm start` | Run from compiled JS |
| `npm run seed` | Run TypeScript seeder |
| `npm run seed:prod` | Run seeder from built files |
| `npm run test` | Run Jest tests with coverage |
| `npm run test:watch` | Watch mode for Jest |

---

## 🧭 API Quick Reference

### 🔐 Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### 👥 Clients
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/clients/:id`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

### 🛒 Products
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/products/code/:code`

### 📦 Deliveries
- `POST /api/deliveries` (validates and decreases stock)
- `GET /api/deliveries/client/:clientId/history`

### 📘 Swagger
- UI: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)  
- JSON Spec: [http://localhost:4000/api/docs.json](http://localhost:4000/api/docs.json)

---

## 💬 Sample Request — Create Delivery
```json
{
  "clientId": 1,
  "notes": "Order #123",
  "items": [
    { "productId": 10, "quantity": 2 },
    { "productId": 12, "quantity": 1 }
  ]
}
```

---

## 🗂 Project Structure (high-level)

```
src/
 ├─ app.ts              # Express setup & route mounting
 ├─ config/db.ts        # Sequelize configuration
 ├─ models/             # Sequelize models
 ├─ dao/                # Data access layer
 ├─ services/           # Business logic
 ├─ controllers/        # Route handlers
 ├─ routes/             # Express routers
 ├─ middleware/         # Validation, auth, etc.
 ├─ dtos/               # Type definitions
 ├─ utils/              # Helpers (hash, jwt, validation)
 ├─ docs/swagger.ts     # OpenAPI specification
 └─ seeders/seeder.ts   # Sample data seeder

tests/                 # Jest unit tests
```

---

## ⚠️ Production Notes

- 🔒 Use strong secrets for:
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
- 🚫 Disable `sequelize.sync({ alter: true })` in production — use migrations instead.
- 🧩 Add logging, monitoring, and error tracking (e.g., Winston + Sentry).
- 📦 Configure persistent storage for PostgreSQL in Docker (`volumes:` section).

---

## ✨ Tech Highlights

- Fully typed API with TypeScript (strict mode)
- Modular architecture (DAO + Services + Controllers)
- Automated DB seeding
- Integrated Swagger documentation
- Transactional stock validation
- Jest test coverage ready

---

## 📄 License

This project is distributed under the **MIT License**.  
Feel free to use, modify, and share it under the same terms.
