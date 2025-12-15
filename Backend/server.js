// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const runMigrations = require('./model/migrate');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/Authentication/auth');
const sessionRoutes = require('./routes/Session/SessionRoute');
// const messageRoutes = require('./routes/Message/MessageRoute');

const errorHandler = require('./Middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
// app.use('/api/messages', messageRoutes);

// Start server after migrations finish
(async () => {
  await runMigrations();
  await testConnection();
  // Put error handler last
  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
})();
