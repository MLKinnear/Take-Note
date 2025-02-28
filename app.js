require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const noteRoute = require('./routes/noteRoute');
const path = require('path');
const methodOverride = require('method-override');
const { isAuthenticated, logRequests, errorHandler} = require('./middlewares/auth');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:5000'}));
app.use(cookieParser());
app.use(logRequests);
app.use(expressLayouts);
app.set("view engine", "ejs");

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enabling DELETE function in browser
app.use(methodOverride('_method'));

// API Routes
app.use('/api/auth', authRoute);
app.use('/notes', noteRoute);

// Routes to notes if token is present or login if not
app.get('/', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/notes');
    } else {
    res.redirect('/login');
    }
});

// Renders login
app.get('/login', (req, res) => {
    res.render('login');
    });

// Renders register
app.get('/register', (req, res) => {
    res.render('register');
    });

//Renders notes if Auth
app.get('/notes', isAuthenticated, (req, res) => {
    res.render('index', { user: req.user });
    });

// Log out redirect to login page
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
    })

// Error middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));