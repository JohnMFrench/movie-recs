import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
    const { query, method } = req;
    const movie_id = parseInt(query.movie_id as string, 10);

    res.status(200).json({ movie_id: movie_id })
}