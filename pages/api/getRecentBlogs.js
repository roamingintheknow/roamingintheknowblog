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
      // Retrieve the 5 most recently updated blogs
      const blogs = await db
        .collection('blogs')
        .find({})
        .sort({ edited_at: -1 })  // Sort by `edited_at` in descending order
        .limit(5)                 // Limit the result to 5 blogs
        .toArray();

      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
