const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const register = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Usuário já existe');

  const user = new User({ name, email, password });
  await user.save();
  return { message: 'Usuário registrado com sucesso' };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Credenciais inválidas');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Credenciais inválidas');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  return { token };
};

module.exports = { register, login };