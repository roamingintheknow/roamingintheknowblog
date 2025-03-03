import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


interface ContinentData {
  continent: string;
  countries: string[];
}


// Utility function to capitalize words and replace underscores with spaces
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ menuItems: { label: string; submenu: { label: string; href: string }[] }[] } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    // Build the aggregation pipeline
    const queryPipeline = [
      {
        $group: {
          _id: '$continent',
          countries: { $addToSet: '$country' },
        },
      },
      {
        $project: {
          _id: 0, // Remove `_id`
          continent: '$_id', // Rename `_id` to `continent`
          countries: 1,
        },
      },
    ];

    // Execute the aggregation pipeline and type it as `ContinentData[]`
    const data: ContinentData[] = await db.collection('blogs').aggregate<ContinentData>(queryPipeline).toArray();

    // Transform the data into the required format
    const menuItems = data.map(item => ({
      label: capitalizeWords(item.continent),
      submenu: item.countries.map(country => ({
        label: capitalizeWords(country),
        href: '#', // Replace this with actual links or parameters
      })),
    }));

    return res.status(200).json({ menuItems });
  } catch (error) {
    console.error('❌ Error fetching menu data:', error);
    return res.status(500).json({ error: 'Failed to fetch menu data' });
  }
}
