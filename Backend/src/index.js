const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/user.model');
const Message = require('./models/message.model');
const { connectDB } = require('./lib/db');
const { clerkMiddleware } = require('@clerk/express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const job = require('./lib/cron');
const clerkwebhook = require('./webhooks/clerk.webhoook');
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
const { app, server } = require('./lib/socket');

 

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const publicDir = path.join(process.cwd(), 'public');

app.use("/api/webhooks/clerk",express.raw({type: "application/json"}), clerkwebhook);

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
dotenv.config();
app.use(express.json());
app.use(clerkMiddleware());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
    res.send('Hello World!');
});

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, 'index.html'), (err) => {
            if (err) {
                next(err);
            }
        });

    });

};





server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);

    if (process.env.NODE_ENV === 'production') {
        job.start();
    }
})