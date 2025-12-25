import bcrypt from "bcrypt";
import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    await db.connectDb();
    const { email, code, password } = req.body;

    if (!email) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Vui lòng nhập email." });
    }

    if (!code) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Vui lòng nhập mã số xác nhận." });
    }

    if (!password || password.length < 6) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    // Normalize mã số: loại bỏ khoảng trắng và chỉ lấy số
    const normalizedCode = code.toString().trim().replace(/\s+/g, "").replace(/\D/g, "");

    if (normalizedCode.length !== 6) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mã số xác nhận phải có đúng 6 chữ số." });
    }

    // Tìm người dùng với email và mã số (select cả resetCode và resetCodeExpires)
    const user = await User.findOne({ email }).select("resetCode resetCodeExpires password");
    if (!user) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Email không tồn tại trong hệ thống." });
    }

    // Normalize mã số đã lưu trong database
    const storedCodeNormalized = user.resetCode ? user.resetCode.toString().trim().replace(/\s+/g, "").replace(/\D/g, "") : "";

    // Debug logging
    console.log("Reset code check:", {
      email: email,
      userId: user._id,
      receivedCode: code,
      normalizedCode: normalizedCode,
      storedCode: user.resetCode,
      storedCodeType: typeof user.resetCode,
      storedCodeNormalized: storedCodeNormalized,
      resetCodeExpires: user.resetCodeExpires,
      codesMatch: storedCodeNormalized === normalizedCode,
    });

    // Kiểm tra mã số (so sánh sau khi normalize)
    if (!user.resetCode || storedCodeNormalized !== normalizedCode) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mã số xác nhận không đúng." });
    }

    // Kiểm tra mã số đã hết hạn chưa
    if (!user.resetCodeExpires || new Date() > user.resetCodeExpires) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mã số xác nhận đã hết hạn. Vui lòng yêu cầu mã số mới." });
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ." });
    }

    // Mã hóa mật khẩu mới
    const cryptedPassword = await bcrypt.hash(password, 12);

    // Cập nhật mật khẩu và xóa mã số đã sử dụng
    user.password = cryptedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    await db.disconnectDb();

    return res.status(200).json({
      message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    console.error("Error in reset password:", error);
    await db.disconnectDb();
    return res.status(500).json({ message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau." });
  }
}

