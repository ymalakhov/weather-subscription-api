import { JsonController, Get, QueryParam, Res } from 'routing-controllers';
import { Response } from 'express';
import { WeatherData, WeatherService } from '../services/weather-service.js';

@JsonController()
export class WeatherController {
    @Get('/weather')
    async getWeather(@QueryParam('city', { required: true }) city: string, @Res() res: Response) {
        try {
            const data: WeatherData = await WeatherService.getCurrentWeather(city);
            const { temperature, humidity, description } = data;
            return res.status(200).json({ temperature, humidity, description });
        } catch (err: any) {
            if (err.response && err.response.status === 400) {
                return res.status(404).json({ message: "City not found" });
            }
            return res.status(500).json({ message: "Error fetching weather" });
        }
    }
}
