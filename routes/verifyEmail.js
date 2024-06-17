import express from 'express';
import User from '../Model/userModel.js';
import Token from '../Model/tokenModel.js';
import crypto from 'crypto';
import Reset from '../Model/resetModel.js';
import sendMail from '../sendMail.js';
import bcrypt from 'bcrypt';

const verifyEmailRouter = express.Router();

verifyEmailRouter.post('/:id/:token',async(req,res)=>{
  const { id, token } = req.params;
  
  try{
    const user = await User.findOne({_id:id});
      if(!user){
        res.send({error:'invalid link'});
      } 
      if(!user.verified){
        const userToken = await Token.findOne({userId:id,token});
        if(userToken){
          const result = await User.findByIdAndUpdate(id,{ verified:true }, {new:true});
          if(result){
            const delRes = await Token.deleteOne({_id:userToken._id});
            if(delRes){
              res.send({status:true,msg:'success'});
            }else{
              res.send({status:false,msg:'internal server error'});
            }
          }else{
            res.send({status:false,msg:'internal server error'});
          }
        }
      }else{
        res.send({error:'already verified'});
      };
  }catch(error){
    console.log(error)
    res.send({error:'invalid link'});
  }
});

verifyEmailRouter.post('/sendmailforresetpass',async(req,res)=>{
  const { email } = req.body;
  const user = await User.findOne({email:email});
  if(!user) res.send({status:false})
    const name = user.name;
    const id = user._id;
    const findRes = await Reset.findOne({userId:id});
    if(findRes){
      const delRes = await Reset.deleteOne({userId:id}); 
    }
    const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
      const newReset = new Reset({ userId: id, token });
      await newReset.save();
      const subject = 'Reset Your Password.';
      const text = `
      <h1 style="color:black;">Hello, ${name}</h1>
      <h3 style="color:black;font-weight:400;">To reset your password, please click on the following link:</h3>
      <h4 style="color:black;"><a href="http://localhost:5173/resetpassword/${id}/${token}">Reset Your Password</a></h4>
      <h3>Please note that this link is only valid for a limited time. If you facing the invalid error then you will need to submit another request.</h3>
      <p style="color:black;">From,<br>Engineer Link</p>
    `;
    
      const isMailSent = sendMail(email, subject, text);
      if (isMailSent) {
        res.send({ status: true });
      }
});

verifyEmailRouter.post('/islinkvalid/:id/:token',async(req,res)=>{
  const id = req.params.id;
  const token = req.params.token;
  const user = await User.findOne({_id:id});
  if(!user) res.send({status:false,msg:'user Problem'});
  if(user){
    const reset = await Reset.findOne({userId:id,token});
    if(reset){
      res.send({status:true});
    }else{
      res.send({status:false,msg:'token problem'});
    }
  }
})

verifyEmailRouter.post('/resetpassword',async(req,res)=>{
  const { password, id } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password.toString(), salt);
  const result = await User.updateOne({_id:id},{$set:{password:hashedPassword}})
  if(result){
    res.send({status:true});
  }else{
    res.send({status:false});
  }

})

export default verifyEmailRouter;
