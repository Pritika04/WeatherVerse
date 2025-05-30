const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt'); 
const cors = require('cors');

dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

app.use('/auth', authRoutes); 

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