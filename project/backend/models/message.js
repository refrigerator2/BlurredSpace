// models/Message.js
import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import Thread from './Thread.js';
import User from './User.js';

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    thread_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Thread,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'SET NULL',
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'messages',
    timestamps: false,
});

export default Message;
