export type User = {
  userId: string;
  avatar: string | null;
  coverImage: string | null;
  fullName: string | null;
  dob: string | null;
  gender: Gender;
  inviterId: string;
};

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-Binary',
  Other = 'Other'
}

export type UserUpdatePayload = {
  avatar?: string;
  coverImage?: string;
  fullName?: string;
  dob?: string;
  gender?: string;
};
