// models/Thread.js
import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import User from './User.js';

const Thread = sequelize.define('Thread', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    created_by: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
    },
    topic:{
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    message_count:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'threads',
    timestamps: false,
});

export default Thread;
