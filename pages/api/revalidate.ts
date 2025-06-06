import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid slug' });
    }

    // Trigger revalidation for the static route
    await res.revalidate(`/view/${slug}`);

    return res.json({ revalidated: true, slug });
  } catch (err) {
    console.error('❌ Error revalidating:', err);
    return res.status(500).json({ message: 'Error revalidating' });
  }
}
