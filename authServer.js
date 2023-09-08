// Handling Login Logout events

import express from 'express';
import Jwt from 'jsonwebtoken';
import 'dotenv/config';
//require('dotenv').config();

let refreshTokens = [];

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
        expiresIn : '30s'
    });
    
    const refreshToken = Jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    
    res.json({accessToken, refreshToken});
})

app.post('/refreshtoken', (req, res)=> {
    const refreshToken = req.body.token;
    // Unauthorized
    if (!refreshToken) res.sendStatus(401);
    // Forbidden
    if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
    
    Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, data) => {
        console.log(error, data);
        // Forbidden code
        if (error) res.sendStatus(403);
        
        const accessToken = Jwt.sign( {username : data.username}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn : '30s'
        });
        
        res.json({ accessToken});
    });
})

app.post('/logout', (req,res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(refToken => refToken != refreshToken);
    
    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})