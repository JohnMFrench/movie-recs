import { NextApiRequest, NextApiResponse } from 'next';
import http from './rest_client';

export default async function clickApiHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
    const { sessionId, movieId } = req.body;

    if (sessionId && movieId) {
      try {
        const response = await http.post('/click', JSON.stringify({ sessionId, movieId }));
        
        // Handle the response from the API
        res.status(response.status).json(response.data);
      } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ error: 'Invalid request parameters' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
