import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.local.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});