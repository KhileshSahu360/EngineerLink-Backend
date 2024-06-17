import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "./Model/userModel.js";

dotenv.config();
// User's information

const Verifyjsonwebtoken = (req,res,next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  
  // if(!user){
  //   res.sendStatus(401);  
  // }
  jsonwebtoken.verify(token, process.env.SECRET_KEY, async(err, user) => {
    if (err) {
      return res.send({error:true});
    }
    const newUser = await User.findOne({_id:user.id}).populate('followers').populate('following').populate({
      path: 'post.postId', // Populate the postId field in the post array
      model: 'posts' // Specify the model to populate from
    }).select('-password');
    if(newUser){
      req.user = newUser;
    }
    next();
  });
}

const Generatejsonwebtoken = (user) => {
  const token = jsonwebtoken.sign(user, process.env.SECRET_KEY, { expiresIn: '30d' })
    return token;
}


export { Verifyjsonwebtoken, Generatejsonwebtoken};