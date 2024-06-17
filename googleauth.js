import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import User from './Model/userModel.js'
import bcrypt from 'bcrypt';
import { Generatejsonwebtoken } from './jsonwebtoken.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


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
        res.cookie('token',token,{expires:expiryDate, httpOnly:false})
      } else {
        return res.redirect('http://localhost:5173/servererror');
      }
    
    } catch (error) {
      return res.redirect('http://localhost:5173/servererror');
    }
    
    res.redirect('/home');
  });




export default googleRouter;
