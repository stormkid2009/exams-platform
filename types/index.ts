export interface IData {
    email: string;
}

export interface ISession {
    id: string;
    userEmail: string;
    testID: string;
    date?:Date;
    result?:"unknown" | "passed" | "failed"
}