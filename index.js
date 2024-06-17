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

const frontend_url = process.env.FRONTEND_URL;
const cors_frontend_url = process.env.FRONTEND_URL_CORS;

app.use(express.json());
app.use(cors({
  origin : '*',
  credentials : true
}));

app.use(session({
  secret : 'Eng@1234',
  resave: false,
  saveUninitialized: true,
  cookie : {secure:true}
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
    // path: '/',
    // domain: 'localhost',
    secure: true, // Only send the cookie over HTTPS
    httpOnly: false,
    sameSite:'None' // Prevent access from client-side JavaScript
  });

  res.send('welcome to engineer Link');
})

app.get('/istokenvaid',Verifyjsonwebtoken, async(req,res)=>{
  res.send({user:req.user,error:false});
})
app.get('/home',(req,res)=>{
  res.redirect(`${frontend_url}`);
})

app.get('/login',(req,res)=>{
  res.redirect(`${frontend_url}signin`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,(req,res)=>{
  console.log('server running in 3000 port')
});