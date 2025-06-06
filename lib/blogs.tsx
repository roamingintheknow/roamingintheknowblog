import { connectToDatabase } from '@/lib/mongodb';

export async function fetchAllPublishedPostsFromMongo() {
  const { db } = await connectToDatabase();

  const posts = await db
    .collection('blogs')
    .find()
     // .find({ published: true })
    .project({ slug: 1 }) // only return the slug
    .toArray();

  return posts;
}

export async function fetchPostBySlug(slug: string) {
  const { db } = await connectToDatabase();

  // const post = await db.collection('blogs').findOne({ slug, published: true });
  const post = await db.collection('blogs').findOne({ slug});

  return post;
}
