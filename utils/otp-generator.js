const generateOTP = (len) => {
  let OTP = '';
  const characters = '123456789'; // Các ký tự được sử dụng để tạo mã OTP

  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length); // Chọn một ký tự ngẫu nhiên từ chuỗi ký tự
    OTP += characters[randomIndex]; // Thêm ký tự ngẫu nhiên vào mã OTP
  }

  return OTP;
};

module.exports = generateOTP;
