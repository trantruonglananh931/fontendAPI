export type UserProfileToken = {
  userName: string;
  email: string;
  token: string;
};

export type UserProfile = {
  userName: string;
  email: string;
};

export type User = {
  username: string;
  emailAddress: string;
  password?: string; 
  image: string | null;
  birthDay: string | null;
};

export type UserInformation = {
  image: string; 
  year: string;
  month: string;
  day: string;
};
