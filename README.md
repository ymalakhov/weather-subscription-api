# Weather Forecast API

A Node.js/TypeScript service for subscribing to weather updates via email. Uses Routing‑Controllers, Sequelize, Umzug for SQL migrations, and Docker Compose for local setup.

**Execution flow:**

1. **Migrations**: On startup, runs raw SQL files in `migrations/` via Umzug.
2. **Database connection**: Authenticates with Postgres using Sequelize.
3. **Server boot**: Initializes Express, routing-controllers, static assets, and Swagger UI.
4. **Job scheduling**: Schedules hourly and daily email jobs via node-cron.

## ☁️ Cloud running

The application is deployed on [Render](https://render.com) and can be accessed here:

https://weather-subscription-api-isl6.onrender.com/docs

https://weather-subscription-api-isl6.onrender.com/subscribe.html

## 🚀 Local running with Docker

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
* This command creates and starts the containers for all services defined in docker-compose.yml.
```bash
docker-compose up -d
```

* If needed to re-build all images before containers starts
```bash
docker-compose up --build -d
```

For terminating:
* Stops and removes containers, networks, and volumes.
```bash
docker-compose down
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

## 🌠 Examples of sent emails
![alt text](images/image-2.png)
![alt text](images/image-1.png)
---

Enjoy your Weather Forecast API!