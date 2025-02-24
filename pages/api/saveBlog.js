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
    const collection = db.collection('blogs');
    const { blog } = req.body;
    if (!blog || !blog.title || !blog.slug) {
      return res.status(400).json({ error: 'Blog must have a title and a slug' });
    }

    try {
      const filter = { $or: [{ title: blog.title }, { slug: blog.slug }] };
      const { _id, ...updateData } = blog; // Exclude _id from update
      const update = { $set: updateData };
      const options = { upsert: true };
      const result = await collection.updateOne(filter, update, options);
      if (result.upsertedCount > 0) {
        res.status(200).json({ message: 'Blog created successfully!', result });
      } else {
        res.status(200).json({ message: 'Blog updated successfully!', result });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to save blog' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
