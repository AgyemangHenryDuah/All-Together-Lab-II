require('dotenv').config();
const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    require: true,               // Force SSL connection
    rejectUnauthorized: false    // Ignore SSL certificate validation
  }
})

pool.connect()
  .then(() => console.log('Connected to RDS PostgreSQL database'))
  .catch((err) => console.error('Error connecting to RDS:', err));

// Test database connection
// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error('Error acquiring client', err.stack);
//   }
//   client.query('SELECT NOW()', (err, result) => {
//     release();
//     if (err) {
//       return console.error('Error executing query', err.stack);
//     }
//     console.log('Connected to PostgreSQL database');
//   });
// });

module.exports = pool;