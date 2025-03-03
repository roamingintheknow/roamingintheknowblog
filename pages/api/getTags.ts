import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// Define TypeScript interface for the aggregation result
interface TagCount {
  _id: string;
  count: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ tags: string[] } | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { categories } = req.query;

    // Ensure categories are provided
    if (!categories || typeof categories !== 'string') {
      return res.status(400).json({ error: 'Categories are required as a comma-separated string' });
    }

    // Convert the comma-separated categories string into an array
    const categoriesArray = categories.split(',').map(category => category.trim());

    // Aggregation pipeline to find the most used tags for the given categories
    const mostUsedTags: TagCount[] = await db
      .collection('blogs')
      .aggregate<TagCount>([
        { $match: { category: { $in: categoriesArray } } }, // Filter by categories
        { $unwind: '$tags' }, // Deconstruct tags array
        { $group: { _id: '$tags', count: { $sum: 1 } } }, // Group by tags and count each occurrence
        { $sort: { count: -1, _id: 1 } }, // Sort by count in descending order
        { $limit: 20 }, // Limit to top 20 tags
      ])
      .toArray();

    // Extract only the tag names
    const tags = mostUsedTags.map(tag => tag._id);

    return res.status(200).json({ tags });
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    return res.status(500).json({ error: 'Failed to fetch tags' });
  }
}
