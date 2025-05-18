import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import express from 'express';
import { fileURLToPath } from 'url';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { Umzug, SequelizeStorage } from 'umzug';
import fs from 'fs';

import { sequelize } from './models/index.js';
import { SubscriptionController } from './controllers/subscription-controller.js';
import { CustomErrorHandler } from './middlewares/custom-error-handler.js';
import { WeatherController } from './controllers/weather-controller.js';
import { initWeatherJobs } from './jobs/weather-jobs.js';

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run SQL migrations via Umzug
async function runMigrations() {
    const umzug = new Umzug({
        migrations: {
            glob: path.join(__dirname, '../migrations/*.sql'),
            resolve: ({ name, path: migrationPath }) => {
                const fullPath = path.resolve(migrationPath!);
                const sql = fs.readFileSync(fullPath, 'utf8');
                return {
                    name,
                    up: async () => {
                        console.log(`🟢 Applying migration ${name}`);
                        await sequelize.query(sql);
                    },
                    down: async () => {
                        console.warn(`⚠️ Down not implemented for migration ${name}`);
                    }
                };
            }
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console
    });

    await umzug.up();
    console.log('✅ All migrations applied');
}

(async () => {
    try {
        // 1) Run migrations
        await runMigrations();

        // 2) Connect to database
        await sequelize.authenticate();
        console.log('🌐 Database connected');

        // 3) Create Express app
        const app = express();

        // 4) Middlewares
        app.use('/', express.static(path.join(__dirname, '../public')));

        // 5) Setup routing-controllers
        useExpressServer(app, {
            routePrefix: '/api',
            controllers: [SubscriptionController, WeatherController],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false,
        });

        // 6) Swagger/OpenAPI
        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(
            storage,
            { routePrefix: '/api' },
            {
                info: {
                    title: 'Weather Forecast API',
                    description: 'Weather API application that allows users to subscribe to weather updates for their city.',
                    version: '1.0.0',
                },
                servers: [{ url: `${process.env.APP_BASE_URL}` }],
            }
        );
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

        // 7) Start server and jobs
        const portEnv = process.env.PORT;
        if (!portEnv) {
            console.error('❌ ERROR: $PORT is not defined');
            process.exit(1);
        }
        const PORT = Number(portEnv);

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Listening on port ${PORT}`);
            console.log(`🚀 Server running at ${process.env.APP_BASE_URL}`);
            console.log(`📖 Swagger UI available at ${process.env.APP_BASE_URL}/docs`);
            console.log(`📝 Subscription form: ${process.env.APP_BASE_URL}/subscribe.html`);
            initWeatherJobs();
        });
    } catch (err) {
        console.error('❌ Fatal error on startup:', err);
        process.exit(1);
    }
})();
