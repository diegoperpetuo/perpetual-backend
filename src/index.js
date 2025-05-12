const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const moviesRoutes = require('./routes/movie');
const authRoutes = require('./routes/authRoutes');
const connectDatabase = require('./database/connection');

require('dotenv').config();
connectDatabase(); // conecta ao Mongo

const app = express();

// Middlewares globais
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from Vercel!' });
});

app.use('/auth', authRoutes);
app.use('/movies', moviesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
module.exports.handler = serverless(app);
