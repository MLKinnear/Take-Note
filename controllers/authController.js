const User = require('../models/User');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//Register Function
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //checks for existing User
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.render('register', { errorMessage: "Email already exists "});
    //creates new user
    await User.create({ username, email, password });
    //renders login page with message
    res.render('login', { successMessage: 'Account was created! Please log in.'});
  } catch (error) {
    //renders register page again with error message
    res.render('register', { errorMessage: error.message });
  }
};

//Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //checks for User in database by email
    const user = await User.findOne({ email });
    //renders login again with error message
    if (!user) return res.render('login', { errorMessage: 'User not found' });
    //compare passoword function to match
    const isMatch = await user.comparePassword(password);
    //if no match render login again with error
    if (!isMatch) return res.render('login', { errorMessage: 'Invalid credentials' });
    //assigns token with .env parameters
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    //stores token in cookies for added security 
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    });
    //Redirects to notes if no errors
    res.redirect('/notes');
  } catch (error) {
    //responds with error message if caught
    res.status(500).json({ error: error.message });
  }
};

//logout function
const logout = (req, res) => {
  //clears cookie with added security
  res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production'});
  //responds with message when successful
  res.status(200).json({ message: 'Logged out successfully '});
};

module.exports = { register, login, logout };
