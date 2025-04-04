require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    require: true,               
    rejectUnauthorized: false    
  }
})

pool.connect()
  .then(() => console.log('Connected to RDS PostgreSQL database'))
  .catch((err) => console.error('Error connecting to RDS:', err));
module.exports = pool;