import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClient: MongoClient | null;
  var _mongoDb: Db | null;
  var _mongoAdminClient: MongoClient | null;
  var _mongoAdminDb: Db | null;
}

let cachedClient = global._mongoClient ?? null;
let cachedDb = global._mongoDb ?? null;

let cachedAdminClient = global._mongoAdminClient ?? null;
let cachedAdminDb = global._mongoAdminDb ?? null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is missing in environment variables');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('roaming-blog-db');

  if (process.env.NODE_ENV !== 'production') {
    global._mongoClient = client;
    global._mongoDb = db;
  }

  return { client, db };
}
export async function connectToAdminDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedAdminClient && cachedAdminDb) {
    return { client: cachedAdminClient, db: cachedAdminDb };
  }

  if (!process.env.ADMIN_MONGODB_URI) {
    throw new Error('❌ ADMIN_MONGODB_URI is missing in environment variables');
  }

  const client = new MongoClient(process.env.ADMIN_MONGODB_URI);
  await client.connect();
  const db = client.db('roaming-blog-db');

  if (process.env.NODE_ENV !== 'production') {
    global._mongoAdminClient = client;
    global._mongoAdminDb = db;
  }

  return { client, db };
}

// import { MongoClient, Db } from 'mongodb';

// let cachedClient: MongoClient | null = null;
// let cachedDb: Db | null = null;


// export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
//   if (cachedClient && cachedDb) {
//     return { client: cachedClient, db: cachedDb };
//   }

//   if (!process.env.MONGODB_URI) {
//     throw new Error('❌ MONGODB_URI is missing in environment variables');
//   }

//   const client = new MongoClient(process.env.MONGODB_URI);
//   await client.connect();
//   const db = client.db('roaming-blog-db');

//   cachedClient = client;
//   cachedDb = db;

//   return { client, db };
// }


// export async function connectToAdminDatabase(): Promise<{ client: MongoClient; db: Db }> {


//   if (!process.env.ADMIN_MONGODB_URI) {
//     throw new Error('❌ MONGODB_URI is missing in environment variables');
//   }

//   const client = new MongoClient(process.env.ADMIN_MONGODB_URI);
//   await client.connect();
//   const db = client.db('roaming-blog-db');

//   return { client, db };
// }

