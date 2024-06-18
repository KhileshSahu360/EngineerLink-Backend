import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import User from './Model/userModel.js'
import bcrypt from 'bcrypt';
import { Generatejsonwebtoken } from './jsonwebtoken.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

dotenv.config();
const frontend_url = process.env.FRONTEND_URL;
const cors_frontend_url = process.env.FRONTEND_URL_CORS;

const app = express();
app.use(cors({
  origin : '*',
  credentials : true ,
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
}));
app.use(express.json());
app.use(cookieParser());



app.use(passport.initialize());



passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret:process.env.CLIENT_SECRET,
  callbackURL:process.env.CALLBACK_URL 
}, (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

const googleRouter = express.Router();

googleRouter.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

googleRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async(req, res) => {  
    const { email, name } = req.user._json;
    try {
      let findRes = await User.findOne({ email: email });
    
      if (!findRes) {
        const newUser = new User({ name, email, password: 'google', verified: true });
        await newUser.save();
        findRes = newUser;
      }
    
      if (findRes) {
        const userId = findRes._id;
        const payLoad = {
          id: userId,
          username: name
        }
        const token = Generatejsonwebtoken(payLoad);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        res.cookie('token',token,{
          expires:expiryDate,
          secure: true, // cookie is only sent over HTTPS
          sameSite: 'None' // or 'Lax' or 'None'
        })
      } else {
        console.log(error)
        return res.redirect(`${frontend_url}servererror`);
      }
    
    } catch (error) {
      console.log(error)
      return res.redirect(`${frontend_url}servererror`);
    }
    
    res.redirect('/home');
  });




export default googleRouter;
