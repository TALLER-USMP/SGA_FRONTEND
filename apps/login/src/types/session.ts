export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateSessionParams {
  baseUrl: string;
  apiToken: string;
  graphToken: string;
}
