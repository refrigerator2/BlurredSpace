import 'dotenv/config'

import { Sequelize } from 'sequelize';
import Fastify from 'fastify';
import cors from '@fastify/cors';

const sequelize = new Sequelize(`${process.env.PGDBURL}`, {
    dialect: 'postgres',
});

const app = Fastify();
await app.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
});
async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Подключено к БД');

        await app.listen({ port: process.env.PORT || 4004 });
        console.log(`🚀 Сервер запущен: http://localhost:${process.env.PORT || 4004}`);
    } catch (err) {
        console.error('❌ Ошибка:', err);
        process.exit(1);
    }
}

start();
