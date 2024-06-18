import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRoutes.js';
import signupRouter from './routes/signupRoutes.js';
import signinRouter from './routes/signinRoutes.js';
import resetPaswordRouter from './routes/resetPassword.js';
import verifyEmailRouter from './routes/verifyEmail.js';
import googleRouter from './googleauth.js';
import postRouter from './routes/postRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import { Verifyjsonwebtoken } from './jsonwebtoken.js';
import { server, app } from './socket.js';

dotenv.config();

const frontend_url = process.env.FRONTEND_URL;
const cors_frontend_url = process.env.FRONTEND_URL_CORS;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: cors_frontend_url,
  credentials: true
}));

app.use(session({
  secret: 'Eng@1234',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: 'None' }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/signin', signinRouter);
app.use('/user', userRouter);
app.use('/signup', signupRouter);
app.use('/tokenauth', verifyEmailRouter);
app.use('/resetpassword', resetPaswordRouter);
app.use('/auth', googleRouter);
app.use('/post', postRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.cookie('myCookie', 'exampleValue', {
    secure: true,
    httpOnly: true,
    sameSite: 'None'
  });

  res.send('Welcome to Engineer Link');
});

app.get('/istokenvaid', Verifyjsonwebtoken, async (req, res) => {
  res.send({ user: req.user, error: false });
});

app.get('/home', (req, res) => {
  res.redirect(`${frontend_url}`);
});

app.get('/login', (req, res) => {
  res.redirect(`${frontend_url}/signin`);
});

const sslOptions = {
  key: fs.readFileSync('path/to/server.key'),
  cert: fs.readFileSync('path/to/server.cert')
};

const PORT = process.env.PORT || 3001;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
