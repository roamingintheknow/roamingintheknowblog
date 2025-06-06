import { connectToAdminDatabase } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Define TypeScript interfaces for request data
interface Blog {
  _id?: string;
  title: string;
  slug: string;
  content?: string;
  tags?: string[];
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    // ✅ Ensure the user is an admin before proceeding
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.NEXT_AUTH_SECRET as string) as {
        email?: string;
        sub?: string;
        role?: string;
        iat?: number;
        exp?: number;
        jti?: string;
      };
      if (!decoded|| decoded.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // ✅ Connect to the database
    const { db } = await connectToAdminDatabase();
    const collection = db.collection<Blog>("blogs");

    // ✅ Validate the request body
    const { blog } = req.body;
    if (!blog?.title || !blog?.slug) {
      return res.status(400).json({ error: "Blog must have a title and a slug" });
    }
    // ✅ Upsert logic: Update if exists, otherwise insert
    const filter = { $or: [{ title: blog.title }, { slug: blog.slug }] };
    const { _id, createdAt, ...updateData } = blog; // Exclude _id from update
    updateData.updatedAt = new Date();

    const update = { $set: updateData, $setOnInsert: { createdAt: new Date() } };
    const options = { upsert: true };

    const result = await collection.updateOne(filter, update, options);

    if (result.upsertedCount > 0) {
      return res.status(201).json({ message: "Blog created successfully!", result });
    } else {
      return res.status(200).json({ message: "Blog updated successfully!", result });
    }
  } catch (error) {
    console.error("❌ Error saving blog:", error);
    return res.status(500).json({ error: "Failed to save blog" });
  }
}
