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
  if (req.method === 'GET') {
    
    const client = await connectToDatabase();
    const db = client.db('roaming-blog-db');
    try {

      // Execute the aggregation pipeline
      const settings = await db.collection('settings')
        .find()  // Get all documents
        .sort({ created_at: -1 })  // Sort by creation date in descending order
        .limit(1)
        .toArray()

      res.status(200).json({ settings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
