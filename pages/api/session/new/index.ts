// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ISession } from '../../../../types';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISession>
) {
  res.status(200).json({ 
    id:'001abc123',
    userEmail:req.body.userEmail,
    testID:'123',
    date: new Date(Date.now()),
    result:'unknown'
   })
}
