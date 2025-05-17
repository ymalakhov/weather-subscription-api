CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    frequency VARCHAR(10) NOT NULL CHECK (frequency IN ('hourly', 'daily')),
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
