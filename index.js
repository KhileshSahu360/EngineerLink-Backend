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
import session from 'express-session'; // Import express-session
import { Verifyjsonwebtoken } from './jsonwebtoken.js';
import chatRouter from './routes/chatRoutes.js';
import { server, app } from './socket.js';
import dotenv from 'dotenv';

dotenv.config();

app.use(express.json());
app.use(cors());

app.use(session({
  secret : 'Eng@1234',
  resave: false,
  saveUninitialized: true,
  cookie : {secure:false}
}))

app.use(passport.initialize());
app.use(passport.session());




app.use('/signin',signinRouter);
app.use('/user',userRouter);
app.use('/signup',signupRouter);
app.use('/tokenauth/',verifyEmailRouter);
app.use('/resetpassword',resetPaswordRouter);
app.use('/auth',googleRouter);
app.use('/post',postRouter);
app.use('/chat',chatRouter);
app.get('/',(req,res)=>{
  res.cookie('myCookie', 'exampleValue', {
    path: '/',
    domain: 'localhost',
    secure: false, // Only send the cookie over HTTPS
    httpOnly: false // Prevent access from client-side JavaScript
  });

  res.send('welcome to engineer Link');
})
app.get('/home',(req,res)=>{
  res.redirect('http://localhost:5173/profile');
})

app.get('/istokenvaid',Verifyjsonwebtoken, async(req,res)=>{
  res.send({user:req.user,error:false});
})
app.get('/home',(req,res)=>{
  res.redirect('http://localhost:5173/');
})

app.get('/login',(req,res)=>{
  res.redirect('http://localhost:5173/signin');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,(req,res)=>{
  console.log('server running in 3000 port')
});