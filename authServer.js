// Handling Login Logout events

import express from 'express';
import Jwt from 'jsonwebtoken';
import 'dotenv/config';

//require('dotenv').config();

const app = express();
const PORT = 5500;

// middleware to recieve json data submitted from client
app.use(express.json());

app.post('/login',  (req, res) => {
    /*
        Authentication
    */
    
    // Authorization
    const data = req.body;
    
    const accessToken = Jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn : '10s'
    });
    
    res.json({accessToken});
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})