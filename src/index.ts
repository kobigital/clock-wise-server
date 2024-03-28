import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { googleOauthStrategy, jwtStrategy } from './config/oauth';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import { IUser } from './models/User';
import cors from 'cors';


// Load environment variables
dotenv.config({ path: '.local.env' })



const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());

// Passport configuration
passport.use(googleOauthStrategy());
passport.use(jwtStrategy());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: IUser, done) => done(null, user));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MONGO_URI is not defined in the environment variables.');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/users', usersRouter);

app.use('/auth', authRouter);

app.get('/api/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});