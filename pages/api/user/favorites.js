import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from "../../../utils/db";

export default async function handler(req, res) {
  await db.connectDb();
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email)
    return res.status(401).json({ error: 'Unauthorized' });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Lấy danh sách yêu thích
  if (req.method === 'GET') {
    return res.json({ favorites: user.favorites });
  }

  // Thêm font yêu thích
  if (req.method === 'POST') {
    const { font, brideGroomName = '' } = req.body;
    if (!font) return res.status(400).json({ error: 'Missing font' });
    if (user.favorites.some(f => f.font === font)) {
      return res.status(400).json({ error: 'Font already in favorites' });
    }
    user.favorites.push({ font, brideGroomName });
    await user.save();
    return res.json({ favorites: user.favorites });
  }

  // Xoá font yêu thích
  if (req.method === 'DELETE') {
    const { font } = req.body;
    user.favorites = user.favorites.filter(f => f.font !== font);
    await user.save();
    return res.json({ favorites: user.favorites });
  }

  // Update brideGroomName cho 1 font
  if (req.method === 'PATCH') {
    const { font, brideGroomName } = req.body;
    let updated = false;
    user.favorites.forEach(fav => {
      if (fav.font === font) {
        fav.brideGroomName = brideGroomName;
        updated = true;
      }
    });
    if (updated) await user.save();
    return res.json({ favorites: user.favorites });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
