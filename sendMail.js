import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendMail = async(email,subject,text) => {

    try{
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });

      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        html: `${text}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return {status:false};
        } else {
          return {status:true};
        }
      });
    }catch(error){
      return {status:false};
    }
}

export default sendMail;