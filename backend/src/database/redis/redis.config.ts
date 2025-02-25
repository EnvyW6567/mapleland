import { configDotenv } from 'dotenv';

configDotenv();

export const redisConfig = {
    port: Number(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST || 'localhost',
};
