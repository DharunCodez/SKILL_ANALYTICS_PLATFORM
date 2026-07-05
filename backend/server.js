const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes'); // New import

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes); // New usage

const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the process using it or set a different PORT in .env.`);
    } else {
        console.error(error);
    }
    process.exit(1);
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
