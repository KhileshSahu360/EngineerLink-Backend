import mongoose from 'mongoose';

import '../dbCongig.js';

const commentSchema = new mongoose.Schema({

  author : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
  comment :{type : String, required:true}
})

const Comment = mongoose.model('comments',commentSchema);
export default Comment;