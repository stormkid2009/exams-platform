import { NextApiRequest,NextApiResponse } from "next";


export interface SubscribeRequest extends NextApiRequest {
    body:{
        document?:string;
        header:string;
        firstOption:string;
        secondOption:string;
        thirdOption:string;
        fourthOption:string;

    };
}

export default function handler(req: SubscribeRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }
    const question = req.body;
    console.log(question);
    return res.status(200).json({ success: true ,data: question});
  }