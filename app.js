require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./src/config/dbConfig')

const app = express();
const PORT = process.env.PORT || 3000;

// Database Initialization
async function initializeDatabaseTables() {
  try {
    // Create images table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS images (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log('Images table ensured');

    // Additional tables can be added here if needed
    // For example:
    // await pool.query(`
    //     CREATE TABLE IF NOT EXISTS users (
    //         id SERIAL PRIMARY KEY,
    //         username TEXT NOT NULL,
    //         email TEXT UNIQUE NOT NULL,
    //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //     );
    // `);

  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Routes
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const imageRoutes = require('./src/routes/imageRoutes');

console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);

app.use('/', dashboardRoutes);
app.use('/image', imageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server with database initialization
async function startServer() {
  try {
    // Initialize database tables before starting the server
    await initializeDatabaseTables();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit the process if server cannot start
  }
}

// Call the start server function
startServer();