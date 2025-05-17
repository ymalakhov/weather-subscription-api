import nodemailer from 'nodemailer';
import { WeatherData } from './weather-service';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  static async sendConfirmation(email: string, token: string) {
    const confirmUrl = `http://${process.env.APP_HOST}/api/confirm/${token}`;
    const unsubscribeUrl = `http://${process.env.APP_HOST}/api/unsubscribe/${token}`;
    const html = `
    <p>Please confirm your subscription by clicking 
      <a href="${confirmUrl}">here</a>.
    </p>
    <p>If you wish to unsubscribe immediately, click 
      <a href="${unsubscribeUrl}">here</a>.
    </p>
  `;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Confirm your weather subscription',
      text: `Confirm: ${confirmUrl}\nUnsubscribe: ${unsubscribeUrl}`,
      html
    });
  }

  static async sendForecast(email: string, city: string, data: WeatherData) {
    const { temperature, humidity, description } = data;
    const text =
      `Current weather in ${city}:\n` +
      `Temperature: ${temperature}°C\n` +
      `Humidity: ${humidity}%\n` +
      `Condition: ${description}`;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Weather update for ${city}`,
      text
    });
  }
}
