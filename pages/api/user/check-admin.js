import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from "../../../models/User";
import db from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.connectDb();
    
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(session.user.id).select("role");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAdmin = user.role === "admin";
    
    return res.status(200).json({ 
      isAdmin,
      role: user.role,
      currentUserId: session.user.id
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
} 