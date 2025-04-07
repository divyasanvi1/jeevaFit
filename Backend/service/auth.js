const jwt=require("jsonwebtoken")
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY=process.env.JWT_SECRET;

async function hashPassword(password){
    return bcrypt.hash(password,10);
}

async function comparePassword(password,hashedPassword){
    return bcrypt.compare(password,hashedPassword);
}

function generateToken(user){
    return jwt.sign({id:user._id,email:user.email},SECRET_KEY,{expiresIn:"7d"});
}

function verifyToken(token){
    return jwt.verify(token,SECRET_KEY);
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };