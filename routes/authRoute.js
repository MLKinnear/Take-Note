const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

//Registers new Users
router.post('/register', register);

//Logs in Users
router.post('/login', login);

//Protects Route from Unauth Users
router.get('/notes', isAuthenticated, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}` });
});

//Logs out User
router.post('/logout', logout);

module.exports = router;