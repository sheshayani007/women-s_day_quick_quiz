import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('quiz');
      const collection = database.collection('results');
      const result = await collection.insertOne(req.body);
      res.status(200).json({ message: 'Quiz results saved successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Error saving quiz results', error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}