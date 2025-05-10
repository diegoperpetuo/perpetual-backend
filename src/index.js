require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const moviesRoutes = require('./src/routes/movies');
const authRoutes = require('./src/routes/auth');
const morgan = require('morgan');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(morgan('dev'));

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas protegidas
app.use('/movies', moviesRoutes);

// Tratamento de rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Conexão com o MongoDB e inicialização do servidor
const PORT = process.env.PORT || 3000;
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
