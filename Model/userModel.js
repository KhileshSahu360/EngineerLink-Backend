import mongoose from 'mongoose';

import '../dbCongig.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true, unique: false},
  verified: {type: Boolean, default:false},
  about: {type: String, default:''},
  heading: {type: String, default:'Edit your subheading'},
  location: {type: String, default:'Choose location'},
  avatar:{type:String, default:'https://res.cloudinary.com/dgdnyeo0y/image/upload/v1716220165/profile_images/v1yuwb17nsmrrs1wx7fd.jpg'},
  education:{
    type: [{
      school : String,
      field : String
    }],
    default:[]
  },
  experience:{
    type: [{
      company : String,
      description : String
    }],
    default:[]
  },
  skill:{
    type: [{
      skillname : String,
    }],
    default:[]
  },
  post : {
    type : [{
      postId : {type : mongoose.Schema.Types.ObjectId, ref : 'posts'},
    }]
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }], 
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }], 
  password : {type: String, required: true, unique: false},
  verified: {type: Boolean, default:false}
})

const User = mongoose.model('users',userSchema);
export default User;