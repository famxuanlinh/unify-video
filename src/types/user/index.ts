export type User = {
  userId: string;
  avatar: string | null;
  coverImage: string | null;
  fullName: string | null;
  dob: string | null;
  gender: string;
  seekingSettings: SeekingSettings;
  location: {
    lat?: number;
    long?: number;
  };
};

interface Location {
  limit: boolean;
  miles: number;
}

interface AgeRange {
  min: number;
  max: number;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-Binary',
  Other = 'Other'
}

export type UpdateUserPayload = {
  avatar?: string;
  coverImage?: string;
  fullName: string;
  dob: string;
  gender?: string;
  seekingSettings?: SeekingSettings;
  location?: {
    lat?: number;
    long?: number;
  };
};

interface SeekingSettings {
  genders?: string[];
  ageRange?: AgeRange;
  location?: Location;
}

interface Location {
  limit: boolean;
  miles: number;
}

interface AgeRange {
  min: number;
  max: number;
}
