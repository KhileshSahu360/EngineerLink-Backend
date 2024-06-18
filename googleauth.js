import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './Model/userModel.js';
import { Generatejsonwebtoken } from './jsonwebtoken.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const frontend_url = process.env.FRONTEND_URL;

const googleRouter = express.Router();

googleRouter.use(cookieParser());

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, cb) => {
  const { email, name } = profile._json;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, password: 'google', verified: true });
      await user.save();
    }

    const token = Generatejsonwebtoken({ id: user._id, username: name });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    cb(null, { token, expiryDate });
  } catch (error) {
    cb(error);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

googleRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

googleRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const { token, expiryDate } = req.user;

    res.cookie('token', token, {
      expires: expiryDate,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });

    res.redirect(`${frontend_url}home`);
  });

export default googleRouter;
