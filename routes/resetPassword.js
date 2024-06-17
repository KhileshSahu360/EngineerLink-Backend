import express from 'express';

const resetPaswordRouter = express.Router();

resetPaswordRouter.put('/',async(req,res)=>{
  const { token } = req.body;
})


export default resetPaswordRouter;