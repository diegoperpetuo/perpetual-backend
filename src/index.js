const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moviesRoutes = require('./routes/movie');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Only connect to database if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const connectDatabase = require('./database/connection');
  connectDatabase();
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const resp = { message: 'Tudo pronto para navegar!!' };
  res.json(resp).status(200);
});

app.use('/auth', authRoutes);

app.use('/movies', moviesRoutes);
app.use('/api', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
}

module.exports = app;

