import express from 'express';
import User from '../Model/userModel.js';
import bcrypt from 'bcrypt';
import sendMail from '../sendMail.js';
import crypto from 'crypto';
import Token from '../Model/tokenModel.js';
import cookie from 'cookie';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(express.json());

const frontend_url = process.env.FRONTEND_URL;
const signupRouter = express.Router();

signupRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.send({ error: 'exist' });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.toString(), salt);
      let newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      const id = newUser._id; // Access _id after saving the user
      const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
      const newToken = new Token({ userId: id, token });
      await newToken.save();
      const subject = 'Verify Your Email Address for Account Activation.';
      const text = `
      <h1 style="color:black;">Hello, ${name}</h1>
      <h3 style="color:black;font-weight:400;">Thank you for registering with [Engineer Link]. To complete the registration process and activate your account, please verify your email address by clicking the link below:</h3>
      <h4 style="color:black;">Click <a href="${frontend_url}accountactivation/${id}/${token}">here</a> to Activate Your Account</h4>
      <p style="color:black;">From,<br>Engineer Link</p>
    `;
    
      const isMailSent = sendMail(email, subject, text);
      if (isMailSent) {
        res.send({ status: true });
      }
    }
  } catch (error) {
    res.send({ status: false, error });
  }
});

export default signupRouter;
