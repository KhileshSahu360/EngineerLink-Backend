import mongoose from 'mongoose';

import '../dbCongig.js';

const postSchema = new mongoose.Schema({

  posttitle : {type:String, required:true},
  postimage : {type:String, required:true},
  postlike : {type:Number, default : 0},
  likedby: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }], 
  postcomment :{
    type : [{
      commentId : {type:mongoose.Schema.Types.ObjectId, ref : 'comments'},
    }],
    default:[]
  },
  author:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
  
})

const Post = mongoose.model('posts',postSchema);
export default Post;