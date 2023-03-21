// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import { Session,ISessionModel } from '../../../../src/models/session.model'
import connectToDB from '../../../../src/lib/mongooseClient';


connectToDB();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const session = new Session({
    email:req.body.userEmail,
    testID:req.body.testId,
  })
  try {

    await session.save();
    res.status(200).json(session)
  } catch (error) {
    res.status(500).json({msg:`error creating session`})
  }

}
