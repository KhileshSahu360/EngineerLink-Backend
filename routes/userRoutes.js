import express from 'express';
import User from "../Model/userModel.js";

const router = express.Router();

router.get('/getuserdata/:userId',async(req,res)=>{
  const userId = req.params.userId;
  try{
    const user = await User.findOne({_id:userId}).populate('followers').populate('following').populate({
      path: 'post.postId', // Populate the postId field in the post array
      model: 'posts' // Specify the model to populate from
    })
    .exec();
    if(user){
      res.send({user})
    }else{
      res.send({status:false})
    }
  }catch(error){
    res.send({status:false});
  }
})

router.get('/getalluser/:localUserId',async(req,res)=>{
  const localUserId = req.params.localUserId;
  try{
    const rslt = await User.findOne({_id:localUserId})
    if(rslt){
      const result = await User.find({_id:{$ne:localUserId}})
      if(result){
        res.send({users:result});
      }else{
        res.send({error:true})
      }
    }else{
      res.send({error:true});
    }
  }catch(error){
    res.send({error:true})
  }
})

router.get('/getuserprofiledata/:userIdToSee/:localUserId',async(req,res)=>{
  const localUserId = req.params.localUserId;
  const userIdToSee = req.params.userIdToSee;
  try{
    const isLocalUserExist = await User.findOne({_id:localUserId});
    if(isLocalUserExist){
      const user = await User.findOne({_id:userIdToSee}).populate('followers').populate('following').populate({
        path: 'post.postId', // Populate the postId field in the post array
        model: 'posts' // Specify the model to populate from
      })
      .exec();
      if(user){
        res.send({user,isLocalUserExist:true});
      }else{
        res.send({status:false})
      }
    }else{
      res.send({IslocalUserExist:false});
    }
  }catch(error){
    res.send({status:false});
  }
})

router.put('/followuser/:localUserId/:newUserId',async(req,res)=>{
  const localUserId = req.params.localUserId;
  const newUserId = req.params.newUserId;
  try{
    const firstResult = await User.updateOne({_id:localUserId},{$push:{following:newUserId}})
    if(firstResult){
      const secondResult = await User.updateOne({_id:newUserId},{$push:{followers:localUserId}});
      if(secondResult){
        res.send({status:true});
      }else{
        res.send({status:false})
      }
    }else{
      res.send({status:false});
    }
  }catch(error){
    res.send({status:false})
  }
})

router.put('/unfollowuser/:localUserId/:newUserId',async(req,res)=>{
  const localUserId = req.params.localUserId;
  const newUserId = req.params.newUserId;
  try{
    const firstResult = await User.updateOne({_id:localUserId},{$pull:{following:newUserId}})
    if(firstResult){
      const secondResult = await User.updateOne({_id:newUserId},{$pull:{followers:localUserId}});
      if(secondResult){
        res.send({status:true});
      }else{
        res.send({status:false})
      }
    }else{
      res.send({status:false});
    }
  }catch(error){
    res.send({status:false})
  }
})

router.put('/removeuserfromfollower/:localUserId/:newUserId',async(req,res)=>{
  const localUserId = req.params.localUserId;
  const newUserId = req.params.newUserId;
  try{
    const firstResult = await User.updateOne({_id:localUserId},{$pull:{followers:newUserId}})
    if(firstResult){
      const secondResult = await User.updateOne({_id:newUserId},{$pull:{following:localUserId}});
      if(secondResult){
        res.send({status:true});
      }else{
        res.send({status:false})
      }
    }else{
      res.send({status:false});
    }
  }catch(error){
    res.send({status:false})
  }
})

router.post('/setbasicdetail/:userId',async(req,res)=>{
  const userId = req.params.userId;

  const { firstValue:name, secondValue:heading, thirdValue:location} = req.body;
  try{
    const nameResult = await User.updateOne({_id:userId},{$set:{name:name}});
    if(nameResult){
      const headingResult = await User.updateOne({_id:userId},{$set:{heading:heading}});
      if(headingResult){
        const locationResult = await User.updateOne({_id:userId},{$set:{location:location}});
        if(locationResult){
          res.send({status:true});
        }
      }
    }
  }catch(error){
    res.send({status:false});
  }
})

router.post('/setabout/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { about } = req.body;
    // Find the user by userId
    let user = await User.updateOne({ _id: userId },{$set:{about:about}});

    // If user is not found, return an error response
    if (user) {
      res.send({status:true})
    }else{
      return res.status(404).json({ error: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/addskill/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { skillname } = req.body;
    // Find the user by userId
    const newSkill = {skillname};
    let user = await User.updateOne({ _id: userId },{$push:{skill:newSkill}});

    // If user is not found, return an error response
    if (user) {
      res.send({status:true})
    }else{
      return res.status(404).json({ error: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/addeducation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstValue:school, secondValue:field} = req.body;
    const newEducation = {school,field}
    // Find the user by userId
    let edu = await User.updateOne({ _id: userId },{$push:{education:newEducation}});

    // If user is not found, return an error response
    if (edu) {
      res.send({status:true})
    }else{
      return res.status(404).json({ error: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/addexperience/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstValue:company, secondValue:description } = req.body;
    const newExperience = {company,description}
    console.log(newExperience);
    // Find the user by userId
    let exp = await User.updateOne({ _id: userId },{$push:{experience:newExperience}});

    // If user is not found, return an error response
    if (exp) {
      res.send({status:true})
    }else{
      return res.status(404).json({ error: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/deleteeducation/:userId/:uniqueId',async(req,res)=>{
  const uniqueId = req.params.uniqueId;
  const userId = req.params.userId;
  const result = await User.findOneAndUpdate(
    { _id: userId }, // Query to find the user by ID
    { $pull: { education: { _id: uniqueId } } }
  );
  if(result){
    res.send({status:true})
    console.log('success')
  }else{
    res.send({status:false})
  }
})
router.get('/deleteexperience/:userId/:uniqueId',async(req,res)=>{
  const uniqueId = req.params.uniqueId;
  const userId = req.params.userId;
  const result = await User.findOneAndUpdate(
    { _id: userId }, // Query to find the user by ID
    { $pull: { experience: { _id: uniqueId } } }
  );
  if(result){
    res.send({status:true})
  }else{
    res.send({status:false})
  }
})
router.get('/deleteskill/:userId/:uniqueId',async(req,res)=>{
  const uniqueId = req.params.uniqueId;
  const userId = req.params.userId;
  const result = await User.findOneAndUpdate(
    { _id: userId }, // Query to find the user by ID
    { $pull: { skill: { _id: uniqueId } } }
  );
  if(result){
    res.send({status:true})
  }else{
    res.send({status:false})
  }
})

router.post('/uploadprofileimg/:userId',async(req,res)=>{
  const { url } = req.body;
  const userId = req.params.userId;

  try{
    const result = await User.updateOne({_id:userId},{$set:{avatar:url}});
    if(result){
      res.send({status:true});
    }else{
      res.send({status:false});
    }
  }catch(error){
    res.send({status:false});
  }
})
export default router;
