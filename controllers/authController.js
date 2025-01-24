const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin123';


const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  await user.save();
  res.status(201).json({ message: "User registered successfully" });
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ userId: ADMIN_EMAIL, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }


  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

// Logout Controller
const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };
