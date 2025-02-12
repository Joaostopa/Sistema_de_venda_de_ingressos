
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { JWT_SECRET } = require('../middlewares/auth');


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Senha incorreta' });
    

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
