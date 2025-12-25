import { validateEmail } from "../../../utils/validation";
import db from "../../../utils/db";
import User from "../../../models/User";
import { sendEmail } from "../../../utils/sendEmails";
import { resetEmailTemplate } from "../../../emails/resetEmailTemplate";

// Tạo mã số OTP 6 chữ số
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await db.connectDb();
    const { email } = req.body;
    
    if (!email) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Vui lòng nhập email." });
    }
    
    if (!validateEmail(email)) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Email không hợp lệ." });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Email này không tồn tại trong hệ thống." });
    }
    
    // Tạo mã số OTP 6 chữ số
    const resetCode = generateOTP();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút
    
    // Lưu mã số vào database bằng findByIdAndUpdate để đảm bảo field được lưu
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        resetCode: resetCode,
        resetCodeExpires: resetCodeExpires,
      },
      { new: true, runValidators: true }
    ).select("resetCode resetCodeExpires");
    
    // Verify mã số đã được lưu
    console.log("Forgot password - Code saved:", {
      userId: user._id,
      email: email,
      resetCode: updatedUser.resetCode,
      resetCodeExpires: updatedUser.resetCodeExpires,
      generatedCode: resetCode,
      codesMatch: updatedUser.resetCode === resetCode,
    });
    
    // Gửi email với mã số
    await sendEmail(email, resetCode, "", "Mã số đặt lại mật khẩu - Font Chữ Wedding", resetEmailTemplate);
    await db.disconnectDb();
    
    return res.status(200).json({
      message: "Mã số đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư.",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    await db.disconnectDb();
    return res.status(500).json({ message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau." });
  }
}