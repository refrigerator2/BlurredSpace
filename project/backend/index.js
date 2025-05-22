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

app.post('/newthread', async (req, res) => {
    const { title, user } = req.body;

    if (!title || !user) {
        return res.status(400).json({ error: 'Не указаны обязательные поля: title или user' });
    }

    try {
        const thread = await Thread.create({
            title: title,
            created_by: user,
            created_at: new Date(),
        });

        res.status(201).json({ message: 'Тема создана', thread });
    } catch (err) {
        console.error('Ошибка при создании темы:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Username or Password not entered"});
    }
    const user = await User.findOne({where: username});
    if(user){
        return res.status(401).json({error: "User is already existing"})
    }
    try{
        const newuser = await User.create({
            username: username,
            password: password,
            createdAt: new Date(),
        })
        res.status(200).json({message: "User created successfully"})
    }
    catch(err){
        console.log(err);
    }
})
start();
