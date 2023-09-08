import express from 'express';
import Jwt from 'jsonwebtoken';
import 'dotenv/config';

//require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware to recieve json data submitted from client
app.use(express.json());

const books = [
    {
        id : 1,
        name : 'Chi Pheo',
        author : 'Nam Cao'
    },
    {
        id : 2,
        name : 'Chien tranh va Hoa binh',
        author : 'Victor Hugo'
    }
]

app.get('/books', authenToken, (req,res) => {
    res.json({ status : "Success", data : books});
})

function authenToken (req, res, next) {
    const authorizationHeader = req.headers['authorization'];
    
    const token = authorizationHeader.split(' ')[1];
    
    if (!token) res.sendStatus(401);
    
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
       console.log(error, data);
       // Forbidden code
       if (error) res.sendStatus(403);
       next();
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})