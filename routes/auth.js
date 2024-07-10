const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = express.Router();
require('dotenv').config();

// Mock user data
const users = [
  { username: 'user1', password: bcrypt.hashSync('password1', 8) }
];

// User login endpoint
router.post('/login', [
  check('username').isString().notEmpty(),
  check('password').isString().notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send('Invalid username or password');
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ auth: true, token });
});

module.exports = router;
