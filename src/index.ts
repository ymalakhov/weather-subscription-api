import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { sequelize } from './models/index.js';
import { SubscriptionController } from './controllers/subscription-controller.js';
import { WeatherController } from './controllers/weather-controller.js';
import { initWeatherJobs } from './jobs/weather-jobs.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use('/', express.static(path.join(__dirname, '../public')));
useExpressServer(app, {
    routePrefix: '/api',
    controllers: [SubscriptionController, WeatherController],
});

const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(
    storage, { routePrefix: '/api' },
    {
        info: {
            title: 'Weather Forecast API',
            description: 'Weather API application that allows users to subscribe to weather updates for their city.',
            version: '1.0.0'
        },
        servers: [
            { url: `http://${process.env.APP_HOST || 'localhost:3000'}/api` }
        ]
    }
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

const PORT = process.env.PORT;
sequelize.authenticate().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
        initWeatherJobs();
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
