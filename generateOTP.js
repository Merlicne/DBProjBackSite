function generateOTP(otpLength = 6) {
    // Characters to be included in the OTP
    const digits = '0123456789';
  
    // Generate the OTP
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
  
    return otp;
  }
  

module.exports = generateOTP;
  