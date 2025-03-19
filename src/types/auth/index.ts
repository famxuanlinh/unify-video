export type JWT = {
  access: string;
  refresh: string;
  stream: string;
};

export type SigninData = {
  access: string;
  refresh: string;
  userId: string;
  privateKey: string;
  encryptionKey: string;
  role: null;
};
