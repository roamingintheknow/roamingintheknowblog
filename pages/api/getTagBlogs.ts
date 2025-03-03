import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// Define TypeScript interface for a blog post
interface BlogPost {
  _id: string;
  title: string;
  tags: string[];
  category: string;
  country: string;
  continent: string;
  edited_at: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ blogs: BlogPost[] } | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { searchString } = req.query;

    // Ensure query parameter is a string
    const searchQuery = typeof searchString === 'string' ? searchString : undefined;

    // Define the MongoDB search query
    const query = searchQuery ? { tags: { $in: [searchQuery] } } : {};

    // Retrieve the 5 most recently updated blogs matching the search criteria
    const blogs = await db
      .collection<BlogPost>('blogs')
      .find(query)
      .sort({ edited_at: -1 }) // Sort by `edited_at` in descending order
      .limit(5) // Limit to top 5 blogs
      .toArray();

    return res.status(200).json({ blogs });
  } catch (error) {
    console.error('❌ Error fetching recent blogs:', error);
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}
