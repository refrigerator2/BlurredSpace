import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.PGDBURL, {
    dialect: 'postgres',
    logging: false,
});

export default sequelize;
