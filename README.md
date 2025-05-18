# Weather Forecast API

A Node.js/TypeScript service for subscribing to weather updates via email. Uses Routing‑Controllers, Sequelize, Umzug for SQL migrations, and Docker Compose for local setup.

**Execution flow:**

1. **Migrations**: On startup, runs raw SQL files in `migrations/` via Umzug.
2. **Database connection**: Authenticates with Postgres using Sequelize.
3. **Server boot**: Initializes Express, routing-controllers, static assets, and Swagger UI.
4. **Job scheduling**: Schedules hourly and daily email jobs via node-cron.

## 🚀 Local Setup with Docker

### 1. Clone the repository

```bash
git clone https://github.com/ymalakhov/weather-subscription-api.git
cd weather-api
```

### 2. Create a `.env` file in project root

```env
# PostgreSQL
DB_NAME=weather
DB_USER=postgres
DB_PASS=postgres
DB_PORT=5432

# Email (Gmail App Password or Ethereal)
EMAIL_FROM=youremail@example.com
EMAIL_PASS=yourEmailAppPassword

# WeatherAPI.com Key
WEATHER_API_KEY=yourWeatherApiKey

# Public base URL for links (no trailing slash)
APP_BASE_URL=http://localhost:3000

# Time zone for cron jobs
TIMEZONE=Europe/Kyiv

# Application port (matching Docker Compose)
PORT=3000
```

> **⚠️** Do **not** commit this file—ensure it’s listed in `.gitignore`.

### 3. Start services

For starting:
```bash
docker-compose up -d # Сreate and start the containers for all services defined in docker-compose.yml.
docker-compose up --build -d # If needed to re-build all images before containers starts
```
For terminating:
```bash
docker-compose down # Stops and removes containers, networks, and volumes.
```

This will bring up:

* **postgres-db** on port 5432
* **weather-app** on port 3000

### 4. Verify

* Check logs:

  ```bash
  docker-compose logs -f weather-app
  ```
* Wait until you see `Server running at http://localhost:3000` in the output.

## 🌐 Available Endpoints

* **Swagger UI (API docs)**
  ```
  http://localhost:3000/docs
  ```

* **Subscription form (static HTML)**
  ```
  http://localhost:3000/subscribe.html
  ```

## ☁️ Deployed on Render

The application is also deployed on [Render](https://render.com) and can be accessed here:

https://weather-subscription-api-isl6.onrender.com/docs

https://weather-subscription-api-isl6.onrender.com/subscribe.html

---

Enjoy your Weather Forecast API!