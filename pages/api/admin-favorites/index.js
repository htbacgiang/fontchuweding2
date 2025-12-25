import db from '../../../utils/db';
import Favorite from '../../../models/Favorite';

export default async function handler(req, res) {
  try {
    await db.connectDb();
    const allFavorites = await Favorite.find({}).lean();
    return res.status(200).json({ data: allFavorites });
  } catch (error) {
    console.error('Error getting admin favorites:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
