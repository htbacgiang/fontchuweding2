import { getServerSession } from "next-auth/next";
import User from "../../../models/User";
import { authOptions } from "../auth/[...nextauth]";
import db from '../../../utils/db';

// API route quản lý font yêu thích và tên cô dâu chú rể
export default async function handler(req, res) {
  try {
    await db.connectDb();

    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id;
    const deviceId = req.query.deviceId || req.body.deviceId;

    if (!userId && !deviceId) {
      return res.status(401).json({ message: "Chưa đăng nhập hoặc thiếu deviceId" });
    }

    // Lấy danh sách font yêu thích và tên cô dâu chú rể
    if (req.method === "GET") {
      let user = null;
      if (userId) {
        user = await User.findById(userId).select("favoriteFonts brideGroomName").lean();
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
      } else if (deviceId) {
        user = await User.findOne({ deviceId }).select("favoriteFonts brideGroomName").lean();
        if (!user) {
          user = await User.create({
            deviceId,
            favoriteFonts: [],
            brideGroomName: ""
          });
        }
      }

      const favoriteFonts = user.favoriteFonts || [];
      const totalItems = favoriteFonts.length;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      return res.status(200).json({
        favoriteFonts: favoriteFonts, // Trả về tất cả fonts
        brideGroomName: user.brideGroomName || "",
        pagination: {
          currentPage: 1,
          totalPages,
          totalItems,
          itemsPerPage,
          hasNextPage: totalPages > 1,
          hasPrevPage: false
        }
      });
    }

    // Thêm font vào danh sách yêu thích
    if (req.method === "POST") {
      const { font } = req.body;
      if (!font || typeof font !== "string") {
        return res.status(400).json({ message: "Font không hợp lệ" });
      }

      let user = null;
      if (userId) {
        user = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { favoriteFonts: font } },
          { new: true }
        ).select("favoriteFonts").lean();
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
      } else if (deviceId) {
        user = await User.findOneAndUpdate(
          { deviceId },
          { $addToSet: { favoriteFonts: font } },
          { new: true, upsert: true }
        ).select("favoriteFonts").lean();
      }

      return res.status(200).json({
        message: "Đã thêm font vào danh sách yêu thích",
        favoriteFonts: user.favoriteFonts,
      });
    }

    // Xóa font khỏi danh sách yêu thích
    if (req.method === "DELETE") {
      const { font } = req.body;
      if (!font || typeof font !== "string") {
        return res.status(400).json({ message: "Font không hợp lệ" });
      }

      let user = null;
      if (userId) {
        user = await User.findByIdAndUpdate(
          userId,
          { $pull: { favoriteFonts: font } },
          { new: true }
        ).select("favoriteFonts").lean();
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
      } else if (deviceId) {
        user = await User.findOneAndUpdate(
          { deviceId },
          { $pull: { favoriteFonts: font } },
          { new: true }
        ).select("favoriteFonts").lean();
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
      }

      return res.status(200).json({
        message: "Đã xóa font khỏi danh sách yêu thích",
        favoriteFonts: user.favoriteFonts,
      });
    }

    // Cập nhật tên cô dâu chú rể
    if (req.method === "PATCH") {
      const { brideGroomName } = req.body;
      if (typeof brideGroomName !== "string") {
        return res.status(400).json({ message: "Tên cô dâu chú rể không hợp lệ" });
      }

      let user = null;
      if (userId) {
        user = await User.findByIdAndUpdate(
          userId,
          { brideGroomName },
          { new: true }
        ).select("brideGroomName").lean();
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
      } else if (deviceId) {
        user = await User.findOneAndUpdate(
          { deviceId },
          { brideGroomName },
          { new: true, upsert: true }
        ).select("brideGroomName").lean();
      }

      return res.status(200).json({
        message: "Đã cập nhật tên cô dâu chú rể",
        brideGroomName: user.brideGroomName,
      });
    }

    return res.status(405).json({ message: "Phương thức không được hỗ trợ" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}