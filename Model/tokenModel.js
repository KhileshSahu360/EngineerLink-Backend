import mongoose from 'mongoose';


const tokenSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  token : {
   type : String,
   required : true
  },
  createdAt: { type: Date, expires: 60 * 60, default: Date.now() }
})

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60*60 });

const Token = mongoose.model('tokens',tokenSchema);
export default Token;