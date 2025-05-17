import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { Subscription } from '../models/index.js';
import { WeatherService } from '../services/weather-service.js';
import { EmailService } from '../services/email-service.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendForecast(sub: Subscription) {
    try {
        const data = await WeatherService.getCurrentWeather(sub.city);
        await EmailService.sendForecast(sub.email, sub.city, data);
        console.log(`📨 Sent forecast to ${sub.email} (${sub.frequency})`);
    } catch (err) {
        console.error(`❌ Error sending to ${sub.email}:`, err);
    }
}

async function hourlyJob() {
    const subs = await Subscription.findAll({
        where: { confirmed: true, frequency: 'hourly' }
    });
    await Promise.all(subs.map(sendForecast));
}

async function dailyJob() {
    const subs = await Subscription.findAll({
        where: { confirmed: true, frequency: 'daily' }
    });
    await Promise.all(subs.map(sendForecast));
}

export function initWeatherJobs() {
    cron.schedule('0 * * * *', hourlyJob, { timezone: process.env.TIMEZONE });
    cron.schedule('0 9 * * *', dailyJob, { timezone: process.env.TIMEZONE });
    console.log('🕒 Weather jobs scheduled: hourly and daily');
}
