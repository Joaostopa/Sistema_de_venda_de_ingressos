// app.js
const express = require('express');
const mongoose = require('mongoose');
const mustacheExpress = require('mustache-express');
const path = require('path');

// Importando as rotas
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const purchaseRoutes = require('./routes/purchases');

const app = express();
const PORT = process.env.PORT || 3000;


const mongoURI = 'mongodb+srv://joaoferreira2001:EVP3xnVFqlWXtZc1@cluster0.mlwej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro na conexão com MongoDB:', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/purchases', purchaseRoutes);


app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});


app.get('/purchases', (req, res) => {
  res.render('purchaseHistory', { title: 'Histórico de Compras', purchases: [] });
});

app.get('/purchases/:id', (req, res) => {
  res.render('ticketDetail', { title: 'Detalhe do Ingresso', purchase: {} });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
