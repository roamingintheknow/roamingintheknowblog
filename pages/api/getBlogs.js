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
    
    const client = await connectToDatabase();
    const db = client.db('roaming-blog-db');
    // const collection = db.collection('blogs');
    const { search,category,country,continent } = req.query;
    try {


      const searchWords = search ? search.split(/\s+/) : [];
      
      // Build the query pipeline
      const queryPipeline = [];

      // Add search match if search query is present
      if (search) {
        queryPipeline.push({
          $match: {
            $or: [
              { 
                title: { 
                  $in: searchWords.map(word => new RegExp(`\\b${word}\\b`, 'i'))
                }
              },
              { 
                tags: { 
                  $in: searchWords.map(word => new RegExp(`\\b${word}\\b`, 'i'))
                }
              }
            ]
          }
        });

        queryPipeline.push({
          $addFields: {
            matchScore: {
              $add: [
                {
                  $size: {
                    $filter: {
                      input: searchWords,
                      as: "word",
                      cond: { $regexMatch: { input: "$title", regex: { $concat: ["\\b", "$$word", "\\b"] }, options: "i" } }
                    }
                  }
                },
                {
                  $size: {
                    $filter: {
                      input: searchWords,
                      as: "word",
                      cond: { $in: ["$$word", "$tags"] }
                    }
                  }
                }
              ]
            }
          }
        });
      }

      // Add filter for category
      if (category) {
        queryPipeline.push({
          $match: {
            category: category
          }
        });
      }

      // Add filter for country
      if (country) {
        queryPipeline.push({
          $match: {
            country: country
          }
        });
      }

      // Add filter for continent
      if (continent) {
        queryPipeline.push({
          $match: {
            continent: continent
          }
        });
      }

      // Sort by matchScore (if search is present)
      if (search) {
        queryPipeline.push({
          $sort: { matchScore: -1 }
        });
      }

      // Execute the aggregation pipeline
      const blogs = await db.collection('blogs').aggregate(queryPipeline).toArray();

      res.status(200).json({ blogs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
