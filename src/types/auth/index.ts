export type AuthData = {
  accountId: string;
  encryptionKey: string;
  privateKey: string;
} & JWT;

export type JWT = {
  access: string;
  refresh: string;
  stream: string;
};
