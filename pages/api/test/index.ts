import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      console.log(data);

      if (!data) {
        res.status(500).json({ msg: 'something went wrong' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ msg: 'something went wrong' });
    }
  } else {
    res.status(405).json({ msg: 'Method Not Allowed' });
    console.log(req.method)
  }
}
