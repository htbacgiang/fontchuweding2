import { NextApiHandler } from "next";
import User from "../../../models/User";
import { LatestUserProfile } from "../../../utils/types";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getLatestUsers(req, res);
    default:
      res.status(404).send("Not found!");
  }
};

const getLatestUsers: NextApiHandler = async (req, res) => {
  const { pageNo = "0", limit = "5" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const page = parseInt(pageNo);
  const pageSize = parseInt(limit);

  try {
    const [results, total] = await Promise.all([
      User.find({})
        .sort({ createdAt: "desc" })
        .skip(page * pageSize)
        .limit(pageSize)
        .select("name email image provider phone address gender role createdAt emailVerified"), // Added role, createdAt, emailVerified
      User.countDocuments({}),
    ]);

    const users: LatestUserProfile[] = results.map(
      ({ _id, name, email, image, provider, phone, address, gender, emailVerified, role, createdAt }) => ({
        id: _id.toString(),
        name,
        email,
        avatar: image, // Map image to avatar for consistency
        provider,
        phone,
        address, // Array of address objects
        gender,
        emailVerified,
        role,
        createdAt
      })
    );

    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export default handler;