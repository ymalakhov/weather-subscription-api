import { JsonController, Post, Get, Param, QueryParam, Res, BadRequestError } from 'routing-controllers';
import { Subscription, sequelize } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { EmailService } from '../services/email-service.js';
import { WeatherService } from '../services/weather-service.js';

@JsonController()
export class SubscriptionController {
    @Post('/subscribe')
    async subscribe(
        @QueryParam('email', { required: true }) email: string,
        @QueryParam('city', { required: true }) city: string,
        @QueryParam('frequency', { required: true }) frequency: 'hourly' | 'daily',
        @Res() res: Response
    ) {
        // Basic input validation
        if (!['hourly', 'daily'].includes(frequency) || !email || !city) {
            throw new BadRequestError('Invalid input');
        }
        // City name characters validation
        const CITY_RE = /^[A-Za-z\s]+$/;
        if (!CITY_RE.test(city)) {
            throw new BadRequestError('Invalid city name. Only letters and spaces allowed.');
        }

        // Check city exists via WeatherService
        try {
            await WeatherService.getCurrentWeather(city);
        } catch (err: any) {
            throw new BadRequestError('Invalid input city name');
        }

        const t = await sequelize.transaction();
        try {
            const existing = await Subscription.findOne({ where: { email }, transaction: t });
            if (existing) {
                await t.rollback();
                return res.status(409).json({ message: "Email already subscribed" });
            }

            const token = uuidv4();
            await Subscription.create(
                { email, city, frequency, token, confirmed: false },
                { transaction: t }
            );

            await EmailService.sendConfirmation(email, token);

            await t.commit();
            return res.status(200).json({ message: "Subscription successful. Confirmation email sent." });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    @Get('/confirm/:token')
    async confirmSubscription(@Param('token') token: string, @Res() res: Response) {
        try {
            const subscription = await Subscription.findOne({ where: { token } });
            if (!subscription) {
                return res.status(404).json({ message: "Token not found" });
            }
            if (subscription.confirmed) {
                return res.status(200).json({ message: "Subscription already confirmed" });
            }
            subscription.confirmed = true;
            await subscription.save();
            return res.status(200).json({ message: "Subscription confirmed successfully" });
        } catch (err) {
            return res.status(400).json({ message: "Invalid token" });
        }
    }

    @Get('/unsubscribe/:token')
    async unsubscribe(@Param('token') token: string, @Res() res: Response) {
        try {
            const subscription = await Subscription.findOne({ where: { token } });
            if (!subscription) {
                return res.status(404).json({ message: "Token not found" });
            }
            await subscription.destroy();
            return res.status(200).json({ message: "Unsubscribed successfully" });
        } catch (err) {
            return res.status(400).json({ message: "Invalid token" });
        }
    }
}
