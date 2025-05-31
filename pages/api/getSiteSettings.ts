import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    // Execute the aggregation pipeline
    const settings = await db.collection('settings')
      .findOne({}, { sort: { created_at: -1 } }); // Getting most recent ssettings

    return res.status(200).json({ settings });
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
}
