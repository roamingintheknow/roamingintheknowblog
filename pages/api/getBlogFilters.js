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
  const client = await connectToDatabase();
  const db = client.db('roaming-blog-db');
  try {
    const categories = await db.collection('blogs').distinct('category');
    const countries = await db.collection('blogs').distinct('country');
    const continents = await db.collection('blogs').distinct('continent');
    res.status(200).json({
      categories,
      countries,
      continents,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
}
