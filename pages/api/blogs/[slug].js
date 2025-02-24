// pages/api/blogs/[slug].js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(process.env.MONGODB_URI);
      const db = client.db('roaming-blog-db');
      const blogsCollection = db.collection('blogs');
      const blog = await blogsCollection.findOne({ slug: slug });
      if (blog) {
        res.status(200).json({ blog });
      } else {
        res.status(404).json({ error: 'Blog not found' });
      }
      client.close();
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
