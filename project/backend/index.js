import 'dotenv/config'

import { Sequelize } from 'sequelize';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { User } from './models/User.js';
import {Thread} from './models/Thread.js';
import {Message} from './models/message.js';
import bcrypt from 'bcrypt'

User.sync()

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
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({where: username});
        if(user && await bcrypt.compare(password, user.password)) {
            const userData = {
                username: user.username,
                password: user.password,
                createdAt: user.created_at,
            };
            res.status(200).json({ message: 'Login successful', userData });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }catch(err){
        console.log(err);
    }
})

start();
