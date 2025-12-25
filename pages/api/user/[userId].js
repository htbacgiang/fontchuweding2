import User from "../../../models/User";
import db from "../../../utils/db";

export default async function handler(req, res) {
  await db.connectDb();
  const { method, query: { userId } } = req;

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(userId).select("name email phone image gender dateOfBirth address role");
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error." });
      }
    case "PUT":
      try {
        const { name, phone, email, image, gender, dateOfBirth, role } = req.body;
        
        // Tạo object cập nhật với các trường có sẵn
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (phone !== undefined) updateFields.phone = phone;
        if (email !== undefined) updateFields.email = email;
        if (image !== undefined) updateFields.image = image;
        if (gender !== undefined) updateFields.gender = gender;
        if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth;
        if (role !== undefined) updateFields.role = role;
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateFields,
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error." });
      }
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
