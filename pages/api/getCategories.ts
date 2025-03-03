import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// Define TypeScript interface for the aggregation result
interface CategoryCount {
  _id: string;
  count: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ categories: string[] } | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    // Aggregation pipeline to find the 20 most commonly used categories
    const mostUsedCategories: CategoryCount[] = await db
      .collection('blogs')
      .aggregate<CategoryCount>([
        { $group: { _id: '$category', count: { $sum: 1 } } }, // Group by category and count occurrences
        { $sort: { count: -1, _id: 1 } }, // Sort by count in descending order, then alphabetically
        { $limit: 20 }, // Limit to top 20 categories
      ])
      .toArray();

    const categories = mostUsedCategories.map(cat => cat._id);

    return res.status(200).json({ categories });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
