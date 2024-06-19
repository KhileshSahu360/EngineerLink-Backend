  import { createServer } from 'http';
import express from 'express';
import { Server } from 'socket.io';
import Conversation from './Model/conversationModel.js'
import mongoose from 'mongoose';
import Message from './Model/messageModel.js';
import CollabCodeHandler from './collabcode.js'

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors:{
    origin:'*'
  }
})

const collabCodeNamespace = io.of('/collabcode');
CollabCodeHandler(collabCodeNamespace);

const onlineUsers = new Set();


io.on('connection',(socket)=>{

  const user = socket.handshake.auth.localUserId;

  socket.join(user);

  onlineUsers.add(user)
  io.emit('online_users', Array.from(onlineUsers));


  socket.on('new_message',async(data)=>{
    const senderId = data.senderId;
    const receiverId = data.receiverId;
    const message = data.message;

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
      }
          if(conversation){
            const result = await Conversation.findByIdAndUpdate(conversation._id,{
              $push:{messageId : newMessage._id}})   
          }
          const messages = await Conversation.findOne({
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
          }).populate({
            path: 'messageId',
            populate: [
              { path: 'senderId', model: 'users' },
              { path: 'receiverId', model: 'users' }
            ]
          }).select('messageId').exec();
          if(messages){
            io.to(senderId).emit('messages_are',{messages})
            io.to(receiverId).emit('messages_are',{messages})
          }else{
              io.to(senderId).emit('messages_are',{messages})
              io.to(receiverId).emit('messages_are',{messages})
            }
  
    }catch(error){
      console.log(error);
    }

  })


  socket.on('get_message',async(data)=>{

    const senderId = data.localUser;
    const receiverId = data.selectedUser;

    try {
      const messages = await Conversation.findOne({
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
      }).populate({
        path: 'messageId',
        populate: [
          { path: 'senderId', model: 'users' },
          { path: 'receiverId', model: 'users' }
        ]
      }).select('messageId').exec();
      if(messages){
          socket.emit('messages_are',{messages})
      }else{
        socket.emit('messages_are',{messages})
        }
      } catch (error) {
        console.log(error)
          socket.emit('messages_are',{error:true})
      }


  })

  socket.on('seen',async(data)=>{
    const senderId = data.selectedUser;
    const receiverId = data.localUser;

    const result = await Message.updateMany({senderId:senderId, receiverId:receiverId}, {$set:{seen : true}});
  })
  
  
  socket.on('disconnect',(socket)=>{
    onlineUsers.delete(user);
    console.log('disconneted')
    io.emit('online_users', Array.from(onlineUsers));
  })
})

export { app, server};