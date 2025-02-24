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
    const { categories } = req.query;

    try {
      // If no categories are provided, return an error or handle accordingly
      if (!categories) {
        return res.status(400).json({ error: 'Categories are required' });
      }
      // Convert the comma-separated categories string into an array
      const categoriesArray = categories.split(',').map(category => category.trim());

      // Aggregation pipeline to find tags related to the specified categories
      const mostUsedTags = await db
        .collection('blogs')
        .aggregate([
          { $match: { category: { $in: categoriesArray } } }, // Filter by categories
          { $unwind: "$tags" },                             // Deconstruct tags array
          { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by tags and count each occurrence
          { $sort: { count: -1, _id: 1 } },                // Sort by count in descending order
          { $limit: 20 }                                  // Limit to top 20 tags
        ])
        .toArray();

      // Map to return only tags
      // const tags = mostUsedTags.map(tag => ({ tag: tag._id, count: tag.count }));
      const tags = mostUsedTags.map(tag => tag._id);

      res.status(200).json({ tags });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
