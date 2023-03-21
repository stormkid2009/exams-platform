declare namespace NodeJS {
    export interface ProcessEnv {
      HOST: string;
      MONGODB_URI: string;
      DB_NAME?: string;
    }
  }
  