import mongoose from 'mongoose';


const resetSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  token : {
   type : String,
   required : true
  }
})


const Reset = mongoose.model('resets',resetSchema);
export default Reset;