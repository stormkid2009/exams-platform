import { NextApiRequest,NextApiResponse } from "next";
import { SituationService } from "src/services/situation.service";
import { SituationQuestion } from "src/types/questions";
import { Messages } from "src/types/common";


const msg:Messages = {
  success:"some bala ",
  failure:"..........",
  wrongMethod:".............",
  invalidData:"........."
} ;

const handler=async(req:NextApiRequest,res:NextApiResponse):Promise<void> =>{


  const method = req.method || "UNKOWN";
  if(!method){
    return res.status(400).json({error:msg.wrongMethod})
  }


  try {
    
  } catch (error) {
    
  }
}
