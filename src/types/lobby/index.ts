export interface GetLobbyParams {
  type: 'MATCH' | 'FRIEND';
  offset: number;
  limit: number;
}
type Location = {
  lat: number;
  long: number;
  name: string;
};

type SeekingSettings = {
  genders: string[];
  ageRange: {
    min: number;
    max: number;
  };
  location: {
    limit: boolean;
    miles: number;
  };
};

type UserProfile = {
  userId: string;
  avatar: string;
  coverImage: string;
  fullName: string;
  dob: string;
  gender: string;
  location: Location;
  hometown: Location;
  bio: string;
  seekingSettings: SeekingSettings;
  nicenessScore: number;
  totalReviews: number;
};

type LastCall = {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  role: string;
  missed: boolean;
};

export type Connection = {
  targetUserProfile: UserProfile;
  lastCall: LastCall;
};

export type LobbyResponse = {
  connections: Connection[];
  total: number;
};
