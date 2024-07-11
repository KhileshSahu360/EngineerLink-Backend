import express from 'express';
import User from "../Model/userModel.js";
import Post from '../Model/postModel.js';
import Comment from '../Model/commentModel.js';
import mongoose from 'mongoose';

const postRouter = express.Router();

postRouter.post('/uploadpost/:userId',async(req,res)=>{
  const userId = req.params.userId;
  const {postText, secure_url:postImage} = req.body;

  try{
    const newPost = new Post({posttitle:postText, postimage:postImage, author:userId});
    const result = await newPost.save();
    if(result){
      const newPostId = {postId:result._id};
      const rslt = await User.updateOne({_id:userId},{$push:{post:newPostId}});
      if(rslt){
        return res.send({status:true,rslt})
      }
    }
  }catch(error){
    return res.send({status:false})
  }
})

postRouter.get('/demo',(req,res)=>{
  res.send("this is demo");
})

postRouter.get('/getpost/:postId/:localUserId',async(req,res)=>{
  const postId = req.params.postId;
  const localUserId = req.params.localUserId;
  try{
      const result = await Post.findOne({ _id: postId })
  .populate('author') // Populate author of the post
  .populate({
    path: 'postcomment.commentId',
    populate: {
      path: 'author', // Populate author of each comment
      model: 'users'
    }
  })
  .exec();
      if(result){
        const user = await User.findOne({_id:localUserId});
        if(user){
          return res.send({post:result,user});
        }else{
          return res.send({error:true});
        }
      }else{
        return res.send({error:true});
      }
    }catch(error){
      console.log(error);
      return res.send({error:true});
  }
})

postRouter.post('/getallpost', async (req, res) => {
  const limit = parseInt(req.body.limit) || 5;
  const excludeIds = req.body.excludeIds || [];

  try {
    const totalPosts = await Post.countDocuments({_id:{$nin:excludeIds.map(id => new mongoose.Types.ObjectId(id))}})
    const sampleSize = Math.min(limit, totalPosts); 

    const excludeObjectIds = excludeIds.map(id => new mongoose.Types.ObjectId(id));

  const posts = await Post.find({ _id: { $nin: excludeObjectIds } })
  .populate('author') // Populate author of the post
  .populate({
    path: 'postcomment.commentId',
    populate: {
      path: 'author', // Populate author of each comment
      model: 'users'
    }
  })

    if (posts) {
      return res.send({ post: posts });
    } else {
      return res.send({ error: true });
    }
  } catch (error) {
    return res.send({ error: true });
  }
});

postRouter.get('/getsinglepost/:postId',async(req,res)=>{
  const postId = req.params.postId;
  try{
      const result = await Post.findOne({_id:postId})
  .populate('author') // Populate author of the post
  .populate({
    path: 'postcomment.commentId',
    populate: {
      path: 'author', // Populate author of each comment
      model: 'users'
    }
  })
  .exec();
      if(result){
          return res.send({post:result});
      }else{
        return res.send({error:true});
      }
    }catch(error){
      return res.send({error:true});
  }
})

postRouter.put('/incrementlike/:postId/:userId',async(req,res)=>{
  const postId = req.params.postId;
  const userId = req.params.userId;
  try{
    const result = await Post.findByIdAndUpdate(postId,{$inc:{postlike:1}},{new:true});
    if(result){
      const pushResult = await Post.findByIdAndUpdate(postId,{$push:{likedby : userId}});
      if(pushResult){
        return res.send({status:true})
      }else{
        return res.send({status:false})
      }
    }else{
      return res.send({status:false})
    }
  }catch(error){
    res.send({status:false})

  }
})

postRouter.put('/decrementlike/:postId/:userId',async(req,res)=>{
  const postId = req.params.postId;
  const userId = req.params.userId;
  try{
    const result = await Post.findByIdAndUpdate(postId,{$inc:{postlike:-1}},{new:true});

    if(result){
      const pullResult = await Post.findByIdAndUpdate(postId,{$pull:{likedby : userId}});
      if(pullResult){
        return res.send({status:true})
      }else{
        return res.send({status:false})
      }
    }else{
      return res.send({status:false})
    }
  }catch(error){
    res.send({status:false})

  }
})

postRouter.post('/addcomment/:postId/:userId',async(req,res)=>{
  const postId = req.params.postId;
  const userId = req.params.userId;
  const { comment } = req.body;


  try{
    const newComment = new Comment({author:userId,comment:comment});
    const result = await newComment.save();
    if(result){
      const commentId = result._id;
      const newCommentObj = {commentId:commentId};
      const rslt = await Post.updateOne({_id:postId},{$push:{postcomment:newCommentObj}})
      if(rslt){
        res.send({status:true});
      }else{
        res.send({status:false});
      }
    }else{
      res.send({status:false});
    }
  }catch(error){
    res.send({status:false});
    
  }
})

postRouter.delete('/deletepost/:postId/:userId',async(req,res)=>{
  const postId = req.params.postId;
  const userId = req.params.userId;
  try{
    const deleteResult = await Post.deleteOne({_id:postId});
  if(deleteResult){
    const deleteFromUserResult = await User.updateOne({_id:userId},{$pull:{post:{postId:postId}}}) 
    if(deleteFromUserResult){
      return res.send({status:true});
    }else{
      return res.send({status:false});
    }
  }else{
    return res.send({status:false});
  }
}catch(error){
    return res.send({status:false});
  }
})
export default postRouter;