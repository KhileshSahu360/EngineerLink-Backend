import User from "../Model/userModel.js";
import express from 'express';
import { Generatejsonwebtoken } from "../jsonwebtoken.js";
import bcrypt from 'bcrypt';
import Token from "../Model/tokenModel.js";
import crypto from 'crypto'
import sendMail from "../sendMail.js";

const app = express();
app.use(express.json());

const signinRouter = express.Router();

signinRouter.post('/',async(req,res)=>{
  const { email, password } = req.body;

  const user = await User.findOne({email});
  if(!user){
    res.send({error:'email error'})
  }else{
    if(user.password === 'google') return res.send({error:'loginwithgoogle'});
    const name = user.name;
    const id = user._id;
    if(user.verified){
      if(user.password){
        const isMatched = await bcrypt.compare(password,user.password);
        if(isMatched){
        const payLoad = {
          id : user.id,
          username : user.name
        }
        const token  = Generatejsonwebtoken(payLoad);
        res.send({status:true,user,token});
      }else{
        res.send({error:'password error'});
      }
    }else{
      res.send({error:'token'});
    }
    }else{
      const rslt = await Token.find({userId:user._id});
      if(rslt){
        const delRes = await Token.deleteOne({userId:user._id});
      }
      const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
      const newToken = new Token({userId:id,token});
      await newToken.save();
      const subject = 'Verify Your Email Address for Account Activation.';
      const text = `
      <h1 style="color:black;">Hello, ${name}</h1>
      <h3 style="color:black;font-weight:400;">Thank you for registering with [Engineer Link]. To complete the registration process and activate your account, please verify your email address by clicking the link below:</h3>
      <h4 style="color:black;">Click <a href="http://localhost:5173/accountactivation/${id}/${token}">here</a> to Activate Your Account</h4>
      <p style="color:black;">From,<br>Engineer Link</p>
    `;
    
      const isMailSent = sendMail(email, subject, text);
      if (isMailSent) {
        res.send({error:'verification error'})
      }
      }
    }
  }
 
)

export default signinRouter;