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
      // Aggregation pipeline to find the 20 most commonly used tags
      const mostUsedCategories = await db
        .collection('blogs')
        .aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } }, // Group by tags and count each occurrence
          { $sort: { count: -1, _id: 1 } },                // Sort by count in descending order
          { $limit: 20 },                         // Limit to top 20 tags
        ])
        .toArray();

      const categories = mostUsedCategories.map(cat => cat._id);

      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
