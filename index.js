import userRouter from './routes/userRoutes.js';
import express from 'express';
import signupRouter from './routes/signupRoutes.js';
import signinRouter from './routes/signinRoutes.js';
import resetPaswordRouter from './routes/resetPassword.js';
import verifyEmailRouter from './routes/verifyEmail.js';
import googleRouter from './googleauth.js';
import postRouter from './routes/postRoutes.js';
import passport from 'passport';
import cors from 'cors';
import session from 'express-session';
import { Verifyjsonwebtoken } from './jsonwebtoken.js';
import chatRouter from './routes/chatRoutes.js';
import dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL_CORS,
  credentials: true
}));

app.use(session({
  secret: 'Eng@1234',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/signin', signinRouter);
app.use('/user', userRouter);
app.use('/signup', signupRouter);
app.use('/tokenauth/', verifyEmailRouter);
app.use('/resetpassword', resetPaswordRouter);
app.use('/auth', googleRouter);
app.use('/post', postRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.cookie('myCookie', 'exampleValue', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  });
  res.send('welcome to engineer Link');
});

app.get('/istokenvaid', Verifyjsonwebtoken, async (req, res) => {
  res.send({ user: req.user, error: false });
});

app.get('/home', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
});

app.get('/login', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}signin`);
});

const PORT = process.env.PORT || 3000;
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
