export interface ISession {
    email: string;
    testIdex: number;
}

type QuestionType = "document" | "situations" | "grammaire" ;
// create interface for sub questions
interface Sub {
    content: string; // like >>>  ahmed ..... a l'ecole.
    options: [
        string,string,string,string
    ]; //we need fixed number of options 4 in most cases >> we can use tuple for this
    answerIndex:number;// 0 here for the first element in the array of options
}

//create interface for the question of situations
interface SituationsSub extends Omit <Sub,'answerIndex'>{
    answerIndex:number[];
}

//create interface for the question in general
interface Question {
    kind:QuestionType;
    subs:Sub[];
}


export interface DocumentModel extends Question {
    texte :string;
    
}



// to override properties use Omit<InterfaceName,'propertyName'>
export interface SituationsModel extends Omit <Question,'subs'>{
    subs:SituationsSub[];
}




export interface GrammaireModel extends Question {}

export interface Messages {
    success:string;
    failure:string;
    wrongMethod:string;
  }