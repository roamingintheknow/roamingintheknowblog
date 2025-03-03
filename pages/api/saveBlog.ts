import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // Adjust the path based on your project structure


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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Ensure the user is an admin before proceeding
    const session = await getServerSession(req, res, authOptions);
    if (!session  || !session.user  || !session.user.role ||  session.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection<Blog>("blogs");

    // ✅ Validate the request body
    const { blog } = req.body;
    if (!blog?.title || !blog?.slug) {
      return res.status(400).json({ error: "Blog must have a title and a slug" });
    }

    // ✅ Upsert logic: Update if exists, otherwise insert
    const filter = { $or: [{ title: blog.title }, { slug: blog.slug }] };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = blog; // Exclude _id from update
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
