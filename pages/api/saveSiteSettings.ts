import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // Adjust the path based on your project structure


// Define TypeScript interface for settings
interface Settings {
  _id?: string;
  landingPhoto1: string;
  landingPhoto2: string;
  landingPhoto3: string;
  createdAt?: Date;
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
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection<Settings>("settings");

    // ✅ Validate the request body
    const settings: Settings = req.body;
    if (!settings?.landingPhoto1 || !settings?.landingPhoto2 || !settings?.landingPhoto3) {
      return res.status(400).json({ error: "Settings must have 3 image URLs" });
    }

    // ✅ Upsert logic: Always update existing settings or insert if none exist
    const currentTime = new Date();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...settingsWithoutId } = settings;
    const updateData = {
      ...settingsWithoutId,
      createdAt: currentTime,
    };

    const filter = {}; // Empty filter to always update the single settings document
    const update = { $set: updateData };
    const options = { upsert: true };

    const result = await collection.updateOne(filter, update, options);

    if (result.upsertedCount > 0) {
      return res.status(201).json({ message: "Settings created successfully!", result });
    } else {
      return res.status(200).json({ message: "Settings updated successfully!", result });
    }
  } catch (error) {
    console.error("❌ Error saving settings:", error);
    return res.status(500).json({ error: "Failed to save settings" });
  }
}
