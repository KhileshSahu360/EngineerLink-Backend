import mongoose from 'mongoose';


const notificationSchema = new mongoose.Schema({

  notificationBy : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
  notificationTo : {type:mongoose.Schema.Types.ObjectId, ref:'users', required:true},
  type :{type : String, required:true},
  content : {type : String , required : true }
},{timestamps:true})

const Notification = mongoose.model('notifications',notificationSchema);
export default Notification;