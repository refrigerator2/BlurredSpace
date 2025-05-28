import 'dotenv/config';
import { Sequelize } from 'sequelize';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import User from './models/User.js';
import Thread from './models/Thread.js';
import Message from './models/message.js';
import bcrypt from 'bcrypt';

console.log(process.env)

// Создаём и инициализируем Sequelize
const sequelize = new Sequelize(process.env.PGDBURL, {
    dialect: 'postgres',
});

const app = Fastify();

// Регистрируем CORS
await app.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
});

// Синхронизируем модели после создания sequelize
await sequelize.authenticate();
console.log('✅ Подключено к БД');

await User.sync();
await Message.sync();
await Thread.sync();

app.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    console.log(username);
    try {
        const user = await User.findOne({ where: { nickname: username } });

        if (user && await bcrypt.compare(password, user.password)) {
            const userData = {
                nickname: user.nickname,
                createdAt: user.created_at,
            };
            return reply.status(200).send({ message: 'Login successful', userData });
        } else {
            return reply.status(401).send({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' });
    }
});

app.post('/newthread', async (request, reply) => {
    const { title, description, username } = request.body;
    console.log(request.body);
    if (!title || !username) {
        return reply.status(400).send({ error: 'Undefined title or username' });
    }

    try {
        const thread = await Thread.create({
            title: title,
            description: description,
            created_by: username,
            created_at: new Date(),
        });

        return reply.status(201).send({ message: 'Topic created', thread });
    } catch (err) {
        console.error('Error while creating topic:', err);
        return reply.status(500).send({ error: 'server error' });
    }
});

app.post('/register', async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return reply.status(400).send({ error: 'Username or Password not entered' });
    }
    const user = await User.findOne({ where: { nickname: username } });
    if (user) {
        return reply.status(401).send({ error: 'User is already existing' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            nickname: username,
            password: hashedPassword,
            created_at: new Date(),
        });
        return reply.status(200).send({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 4004;
app.listen({ port: PORT }).then(() => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
});
