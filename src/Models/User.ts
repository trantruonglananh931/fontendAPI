export type UserProfileToken = {
  userName: string;
  email: string;
  token: string;
  role: string; 
};

export type UserProfile = {
  userName: string;
  email: string;
  token: string;
  role: string; 
};

export type User = {
  username: string;
  emailAddress: string;
  password?: string; 
  image: string | null;
  birthDay: string | null;
};

export type UserInformation = {
  image: string | null; 
  birthDay: string;
};
