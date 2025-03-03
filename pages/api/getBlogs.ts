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
  matchScore?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ blogs: BlogPost[] } | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { search, category, country, continent } = req.query;

    // Ensure query parameters are strings
    const searchQuery = typeof search === 'string' ? search : undefined;
    const categoryQuery = typeof category === 'string' ? category : undefined;
    const countryQuery = typeof country === 'string' ? country : undefined;
    const continentQuery = typeof continent === 'string' ? continent : undefined;

    // Process search keywords
    const searchWords = searchQuery ? searchQuery.split(/\s+/) : [];

    // Build the aggregation pipeline
      // Explicitly define `queryPipeline` as an array of `Document` (MongoDB aggregation stages)
      const queryPipeline: Record<string, unknown>[] = [
        { $sort: { edited_at: -1 } }, // Sort by `edited_at` in descending order
        { $limit: 5 } // Limit the result to 5 blogs
      ];
    // Add search filtering if search query is present
    if (searchQuery) {
      queryPipeline.push({
        $match: {
          $or: [
            { title: { $in: searchWords.map(word => new RegExp(`\\b${word}\\b`, 'i')) } },
            { tags: { $in: searchWords.map(word => new RegExp(`\\b${word}\\b`, 'i')) } },
          ],
        },
      });

      queryPipeline.push({
        $addFields: {
          matchScore: {
            $add: [
              {
                $size: {
                  $filter: {
                    input: searchWords,
                    as: 'word',
                    cond: { $regexMatch: { input: '$title', regex: { $concat: ['\\b', '$$word', '\\b'] }, options: 'i' } },
                  },
                },
              },
              {
                $size: {
                  $filter: {
                    input: searchWords,
                    as: 'word',
                    cond: { $in: ['$$word', '$tags'] },
                  },
                },
              },
            ],
          },
        },
      });
    }

    // Add category filter
    if (categoryQuery) {
      queryPipeline.push({ $match: { category: categoryQuery } });
    }

    // Add country filter
    if (countryQuery) {
      queryPipeline.push({ $match: { country: countryQuery } });
    }

    // Add continent filter
    if (continentQuery) {
      queryPipeline.push({ $match: { continent: continentQuery } });
    }

    // Sort by matchScore if search is present
    if (searchQuery) {
      queryPipeline.push({ $sort: { matchScore: -1 } });
    }

    // Execute the aggregation pipeline
    // const blogs = await db.collection<BlogPost>('blogs').aggregate(queryPipeline).toArray();
    const blogs: BlogPost[] = await db
    .collection<BlogPost>('blogs')
    .aggregate<BlogPost>(queryPipeline)
    .toArray();

    return res.status(200).json({ blogs });
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
}
