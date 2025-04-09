export type User = {
  userId: string;
  avatar: string | null;
  coverImage: string | null;
  fullName: string | null;
  dob: string | null;
  gender: string;
  bio: string;
  seekingSettings: SeekingSettings;
  location: Location;
  hometown: Location;
};

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
  bio?: string;
  seekingSettings?: SeekingSettings;
  location?: Location;
  hometown?: Location;
};

interface Location {
  lat?: number;
  long?: number;
  name?: string;
}

interface SeekingSettings {
  genders?: string[];
  ageRange?: AgeRange;
  location?: SeekingLocation;
}

interface SeekingLocation {
  limit: boolean;
  miles: number;
}

interface AgeRange {
  min: number;
  max: number;
}
