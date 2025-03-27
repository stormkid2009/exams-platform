import { NextApiRequest,NextApiResponse } from "next";
import { SituationService } from "src/services/situation.service";
import { Messages } from "src/types/common";

const msg:Messages = {
  success:"successfully retrieve random situation question  ",
  failure:"failed to retrieve random situation question",
  wrongMethod:"the method is not valid",
  invalidData:"the data is not valid",
} ;

const handler=async(req:NextApiRequest,res:NextApiResponse):Promise<void> =>{


  const method = req.method || "UNKOWN";
  if(method !== "GET"){
    return res.status(400).json({error:msg.wrongMethod})
  }


  try {
    const result = await SituationService.getRandomQuestion({});
    if(!result.data){
      console.log(`something went wrong`);
      return res.status(result.error?.code || 500).json({error:result.error});
    }
    res.status(200).json(result.data);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error:msg.invalidData});
    
  }
}

export default handler;
