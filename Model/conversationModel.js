import mongoose from 'mongoose';

import '../dbCongig.js';

const conversationSchema = new mongoose.Schema({

  participants : [{
    senderId : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
    receiverId : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
  }],
  messageId : [{type:mongoose.Schema.Types.ObjectId, ref:'messages', required:true}],
},{timestamps:true})

const Conversation = mongoose.model('conversations',conversationSchema);
export default Conversation;