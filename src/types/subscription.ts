export type Frequency = 'hourly' | 'daily';

export interface SubscriptionAttributes {
  id?: number;
  email: string;
  city: string;
  frequency: Frequency;
  confirmed?: boolean;
  token?: string;
  created_at?: Date;
}