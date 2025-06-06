import { connectToDatabase } from '@/lib/mongodb';

export async function getPopularBlogs(limit = 7) {
  const { db } = await connectToDatabase();
  const blogs = await db
    .collection('blogs')
    .find({})
    .sort({ edited_at: -1 })
    .limit(limit)
    .toArray();
  return blogs.map((b) => ({
    _id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    coverH: b.coverH,
    coverV: b.coverV,
    coverS: b.coverS,
    edited_at: b.edited_at,
  }));
}
