import express from 'express';
import User from "../Model/userModel.js";
import Conversation from '../Model/conversationModel.js';
import Message from '../Model/messageModel.js';
import mongoose from 'mongoose';

const chatRouter = express.Router();

chatRouter.post('/createchat/:senderId/:receiverId',async(req,res)=>{
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  try{
    const conversation = await Conversation.findOne({
      $or: [
        {
          participants: {
            $elemMatch: {
              senderId: new mongoose.Types.ObjectId(senderId),
              receiverId: new mongoose.Types.ObjectId(receiverId)
            }
          }
        },
        {
          participants: {
            $elemMatch: {
              senderId: new mongoose.Types.ObjectId(receiverId),
              receiverId: new mongoose.Types.ObjectId(senderId)
            }
          }
        }
      ]
    })
    const messageObj = {
      senderId,
      receiverId,
      message
  }
  const newMessage = new Message(messageObj);
  await newMessage.save();

    if(!conversation){
      const newConversation = await Conversation.create({
        participants:[{senderId,receiverId}],
        messageId : [newMessage._id]
      })
      if(newConversation){
        res.send({msg:'new conversation created successfully'})
      }
  }
  if(conversation){
    const result = await Conversation.findByIdAndUpdate(conversation._id,{
      $push:{messageId : newMessage._id}
    })
    if(result){
      res.send({msg:'message push successfully'})
    }
  }

  }catch(error){
    console.log(error);
    res.send({error:true});
  }

})
export default chatRouter;