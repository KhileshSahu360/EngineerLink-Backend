import mongoose from 'mongoose';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DB_URL;
mongoose.connect(`${dbUrl}`);

const db = mongoose.connection;

db.on('connected', ()=>console.log('connrcted to the mongodb:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
});