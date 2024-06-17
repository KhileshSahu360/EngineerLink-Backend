import mongoose from 'mongoose';

import '../dbCongig.js';

const messageSchema = new mongoose.Schema({

  senderId : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
  receiverId : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
  message :{type : String, required:true},
  seen : {type : Boolean , default : false}
},{timestamps:true})

const Message = mongoose.model('messages',messageSchema);
export default Message;