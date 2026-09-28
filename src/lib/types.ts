export type Connection = {
  id: string;
  name: string;
  ip: string;
  port: string;
  login: string;
  pw: string;
  secure?: boolean;
};

export type StoredState = {
  connections?: Connection[];
  selectedConnectionId?: string;
};
