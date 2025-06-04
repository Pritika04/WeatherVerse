const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const cors = require('cors');

dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

app.use('/auth', authRoutes); 
app.use('/api', protectedRoutes);

mongoose.connect(MONGO_URL).then(() => {
    console.log("Database is connected successfully");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((error) => console.log(error)); 

// app.get('/', (req, res) => {
//     res.send('Hello from backend!');
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// Writing logs/debugging statements
// console.log('Loaded PORT:', process.env.PORT);