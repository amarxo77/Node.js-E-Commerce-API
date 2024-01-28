const express = require('express');
const { login, logout, register } = require('../controllers/auth');

const router = express.Router();

router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);

module.exports = router;
