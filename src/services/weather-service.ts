import axios from 'axios';

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

export class WeatherService {
  private static apiUrl = 'http://api.weatherapi.com/v1/current.json';

  static async getCurrentWeather(city: string): Promise<WeatherData> {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(this.apiUrl, {
      params: { key: apiKey, q: city }
    });
    const { temp_c, humidity, condition } = response.data.current;
    return {
      temperature: temp_c,
      humidity,
      description: condition.text
    };
  }
}
