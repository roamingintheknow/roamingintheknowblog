import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await connectToDatabase();
      const db = client.db('roaming-blog-db');

      // Build the aggregation pipeline
      const queryPipeline = [
        {
          $group: {
            _id: "$continent",
            countries: { $addToSet: "$country" }
          }
        },
        {
          $project: {
            _id: 0,
            continent: "$_id",
            countries: 1
          }
        }
      ];

      // Execute the aggregation pipeline
      const data = await db.collection('blogs').aggregate(queryPipeline).toArray();

      // Transform the data into the required format
      const menuItems = data.map(item => ({
        label: capitalizeWords(item.continent),
        submenu: item.countries.map(country => ({
          label: capitalizeWords(country),
          href: '#' // Replace this with actual links or parameters
        }))
      }));
      
      // Utility function to capitalize the first letter of each word and replace underscores with spaces
      function capitalizeWords(str) {
        return str
          .toLowerCase()
          .replace(/_/g, ' ') // Replace underscores with spaces
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }      

      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
