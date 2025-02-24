import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await connectToDatabase();
    const db = client.db('roaming-blog-db');
    const collection = db.collection('settings');
    const settings  = req.body;
    if (!settings || !settings.landingPhoto1 || !settings.landingPhoto2|| !settings.landingPhoto3) {
      return res.status(400).json({ error: 'Settings must have 3 image urls' });
    }

    try {
      const currentTime = new Date();
      const { _id, ...settingsWithoutId } = settings;
      const updateData = {
        ...settingsWithoutId,
        created_at: currentTime
      };
      const result = await collection.insertOne(updateData);
      if (result.upsertedCount > 0) {
        res.status(200).json({ message: 'Settings created successfully!', result });
      } else {
        res.status(200).json({ message: 'Settings updated successfully!', result });
      }
    } catch (error) {
      console.log('error...',error)
      res.status(500).json({ error: 'Failed to save settings' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
