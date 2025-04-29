require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./Routes/usersRoutes');
const jobseekersRoutes = require('./Routes/jobSeekerRoutes');
const websiteStatsRoutes = require('./Routes/websiteStatsRoutes');
const viewwebsitestats = require('./Routes/viewWebsiteStats');
const adminRoutes = require('./Routes/adminRoutes');
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const corsOrigin1 = process.env.CORSORIGIN1;
const corsOrigin2 = process.env.CORSORIGIN2;
const corsOrigin3 = process.env.CORSORIGIN3;
const corsOrigin4 = process.env.CORSORIGIN4;

const allowedOrigins = [corsOrigin1, corsOrigin2, corsOrigin3, corsOrigin4];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you want to allow cookies/auth headers
}));


// Middleware to parse incoming requests 
app.use(express.json());

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use('/users', userRoutes); 
app.use('/jobseekers', jobseekersRoutes);
app.use('/websitestats', websiteStatsRoutes);
app.use('/viewwebsitestats', viewwebsitestats);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send("hello");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});