import 'dotenv/config';
import { Sequelize } from 'sequelize';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import User from './models/User.js';
import Thread from './models/Thread.js';
import Message from './models/message.js';
import bcrypt from 'bcrypt';
import req from "express/lib/request.js";
import fastifySocketIO from 'fastify-socket.io'

console.log(process.env)

const sequelize = new Sequelize(process.env.PGDBURL, {
    dialect: 'postgres',
});

const app = Fastify();
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

Thread.hasMany(Message, { foreignKey: 'thread_id' });
Message.belongsTo(Thread, { foreignKey: 'thread_id' });
await app.register(fastifySocketIO);

app.io.on('connection', (socket) => {
    console.log(`Connected to ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Disconnected from ${socket.id}`);
    })
    socket.on('join_thread', (thread_id) => {
        socket.join(thread_id);
    })
    socket.on('send_message', async ({ threadId, username, content }) => {
        const user = await User.findOne({ where: { nickname: username } });
        if (!user) return;

        const message = await Message.create({
            thread_id: threadId,
            user_id: user.id,
            content,
        });

        await Thread.increment('message_count', { where: { id: threadId } });

        app.io.to(threadId).emit('receive_message', {
            threadId,
            content,
            username,
            created_at: message.created_at,
        });
    });

})

await app.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
});

await sequelize.authenticate();
console.log('✅ Connected to db');

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
    const { title, description, username, topic } = request.body;

    if (!title || !username || !topic) {
        return reply.status(400).send({ error: 'Missing title, username or topic' });
    }

    try {
        const thread = await Thread.create({
            title,
            description: description || '',
            created_by: username,
            created_at: new Date(),
            topic,
            message_count: 0,
        });

        return reply.status(201).send({ message: 'Topic created', thread });
    } catch (err) {
        console.error('Error while creating topic:', err);
        return reply.status(500).send({ error: 'Server error' });
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
        return reply.status(200).send({ message: 'User created successfully', newUser });
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' });
    }
});
app.get('/threads', async (request, reply) => {
    try {
        const threads = await Thread.findAll({
            order: [['created_at', 'DESC']] 
        });
        reply.send(threads);
    } catch (err) {
        console.error('Ошибка при получении тредов:', err);
        reply.status(500).send({ error: 'Server error' });
    }
});
app.get('/thread/:id', async (request, reply) => {
    try{
        const thread_id = request.params.id
        const thread = await Thread.findOne({where: {id: thread_id}});
        console.log(thread, thread_id)
        if (!thread) {
            reply.status(404).send({ error: 'Thread not found' });
        }
        else{
            reply.status(200).send(thread);
        }
    }catch(err){
        console.log(err);
        reply.status(500).send({ error: 'Server error' });
    }
})
app.post('/thread/:id/message', async (request, reply) => {
    try {
        const thread_id = request.params.id;
        const { username, content } = request.body;
        console.log(thread_id, username, content);
        if (!content || !username) {
            return reply.status(400).send({ error: 'Missing content or username' });
        }

        const user = await User.findOne({ where: { nickname: username } });

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        const message = await Message.create({
            thread_id,
            user_id: user.id,
            content,
        });
        await Thread.increment('message_count', { by: 1, where: { id: thread_id } });
        reply.status(201).send(message);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Server error' });
    }
});
app.get('/thread/:id/allmessages', async (request, reply) => {
    try {
        const thread_id = request.params.id
        if (!thread_id) {
            return reply.status(404).send({ error: 'Server didnt get id' });
        }
        const messages = await Message.findAll({
            where: { thread_id: thread_id },
            include: [{
                model: User,
                attributes: ['nickname'],
            }],
            order: [['created_at', 'ASC']],
        });
        console.log(messages);
        reply.status(200).send(messages);
    }
    catch (err) {
        console.error(err);
    }
})
const PORT = process.env.PORT || 4004;
app.listen({ port: PORT }).then(() => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
});
