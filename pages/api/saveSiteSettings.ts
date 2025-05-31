import { connectToAdminDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Define TypeScript interface for settings
interface Settings {
  _id?: string;
  landingPhoto1: string;
  landingPhoto2: string;
  landingPhoto3: string;
  tagline: string;
  aboutBlurb: string;
  created_at?: Date;
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
    const { db } = await connectToAdminDatabase();
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
      created_at: currentTime,
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
