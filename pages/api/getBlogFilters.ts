import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

// Define TypeScript interface for API response
interface FiltersResponse {
  categories: string[];
  countries: string[];
  continents: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<FiltersResponse | { error: string }>) {
  try {
    const { db } = await connectToDatabase();

    // Fetch distinct values for each field
    const categories = await db.collection('blogs').distinct<string>('category');
    const countries = await db.collection('blogs').distinct<string>('country');
    const continents = await db.collection('blogs').distinct<string>('continent');

    return res.status(200).json({
      categories,
      countries,
      continents,
    });
  } catch (error) {
    console.error('❌ Error fetching filters:', error);
    return res.status(500).json({ error: 'Failed to fetch filters' });
  }
}
