import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { googleOauthStrategy, jwtStrategy } from './config/oauth';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import clientsRoute from './routes/clients.route';
import clocksRoute from './routes/clocks.route';
import { IUser } from './models/User';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import timeIntervalsRoute from './routes/time-intervals.route';

// Load environment variables
const envFile = `./env/.${process.env.NODE_ENV}.env`;
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:3000', 'chrome-extension://bgnidecdepkfhbngdcoglefhcmoobimi', 'https://clock-wise-418521.web.app'],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
}));
// Passport configuration
app.use(passport.initialize());
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

mongoose.connect(mongoURI, { tlsCAFile: process.env.AWS_GLOBAL_BUNDLE, tlsAllowInvalidHostnames: true, directConnection: true, retryWrites: false, dbName: 'clockwise' })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/auth', authRouter);
app.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/api/clients', passport.authenticate('jwt', { session: false }), clientsRoute);
app.use('/api/clocks', passport.authenticate('jwt', { session: false }), clocksRoute);
app.use('/api/timeInterval', passport.authenticate('jwt', { session: false }), timeIntervalsRoute);
app.get('/api/user', passport.authenticate('jwt', { session: false }), (req, res) => res.json(req.user));
app.get('/', (req, res) => res.send('Hello from the server!'));


// Start the server
if (process.env.ENV === 'stage') {
    const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
    const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
    if (!SSL_CERT_PATH || !SSL_KEY_PATH) {
        throw { message: 'SSL Variables not found!' }
    }
    https.createServer({
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
    }, app).listen(PORT, () => {
        console.log(`HTTPS Server is running on port ${PORT}`);
    })
} else {
    app.listen(PORT, () => console.log(`HTTP Server is running on port ${PORT}`));
}
