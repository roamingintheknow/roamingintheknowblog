import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    // Retrieve the 5 most recently updated blogs
    const blogs = await db
      .collection('blogs')
      .find({})
      .sort({ edited_at: -1 }) // Sort by `edited_at` in descending order
      .limit(7)                // Limit the result to 5 blogs
      .toArray();

    return res.status(200).json({ blogs });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}
