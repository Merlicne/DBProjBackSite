var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.app_password
    }
});


module.exports = async (email,otp) =>{
    var mailOptions = {
      from: 'Karaoke Nongtao',
      to: email,
      subject: "Verification OTP for Karaoke Nongtao",
      html: `<h1>Verification OTP for Karaoke Nongtao</h1>
        <p>Your OTP is <mark>${otp}</mark></p>
        <p>Thank you for using our service</p>
        <p>Best Regards</p>
        <p>Karaoke Nongtao</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}