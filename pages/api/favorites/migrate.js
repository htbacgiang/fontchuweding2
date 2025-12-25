import db from '../../../utils/db';
import Favorite from '../../../models/Favorite';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Phương thức không được phép' });
  }

  const { deviceId } = req.body;
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Chưa xác thực' });
  }
  if (!deviceId) {
    return res.status(400).json({ message: 'deviceId là bắt buộc' });
  }

  try {
    await db.connectDb();
    const favorite = await Favorite.findOne({ deviceId });
    if (favorite) {
      const update = {};
      if (favorite.fonts?.length) {
        update['$addToSet'] = { 'favorites.fonts': { $each: favorite.fonts } }; // Sửa: $addToSet đúng cú pháp
      }
      if (favorite.brideGroomName) {
        update['$set'] = { 'favorites.brideGroomName': favorite.brideGroomName };
      }
      if (Object.keys(update).length) {
        await User.updateOne(
          { _id: userId },
          update,
          { upsert: true, setDefaultsOnInsert: true }
        );
        await Favorite.deleteOne({ deviceId });
      }
      const updatedUser = await User.findById(userId).lean();
      return res.status(200).json({
        fonts: updatedUser?.favorites?.fonts || [],
        brideGroomName: updatedUser?.favorites?.brideGroomName || '',
      });
    }
    return res.status(200).json({ message: 'Không tìm thấy favorites ẩn danh' });
  } catch (error) {
    console.error('Lỗi di chuyển:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ', error: error.message });
  }
}