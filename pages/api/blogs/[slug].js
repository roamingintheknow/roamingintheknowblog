// pages/api/blogs/[slug].js
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  const { slug } = req.query;
  const { db } = await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const blogsCollection = db.collection('blogs');
      const blog = await blogsCollection.findOne({ slug: slug });
      if (blog) {
        res.status(200).json({ blog });
      } else {
        res.status(404).json({ error: 'Blog not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog',error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
