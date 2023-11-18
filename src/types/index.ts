export interface ISession {
    email: string;
    testIdex: number;
}

type QuestionType = "document" | "situations" | "grammaire" ;


//create interface for the question in general
export interface Question {
    kind:QuestionType;
    content: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    rightAnswer: number;
}

// create interface for the question in document
export interface DocQuestion extends  Omit<Question,"kind">{}
// create interface for the question of document
export interface DocumentQuestion  {
    kind:QuestionType;
    texte :string;
    questions:DocQuestion[];
    
}



// to override properties use Omit<InterfaceName,'propertyName'>
export interface SituationQuestion  extends Question {
    opt5:string;
    rightAnswer2:number;
}




export interface GrammaireQuestion  extends Question {}

export interface Messages {
    success:string;
    failure:string;
    wrongMethod:string;
  }

