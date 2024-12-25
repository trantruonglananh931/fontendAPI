export type UserProfileToken = {
  userName: string;
  nameOfUser : string;
  email: string;
  token: string;
  role: string; 
};

export type UserProfile = {
  userName: string;
  email: string;
  nameOfUser: string; 
  token: string;
  role: string; 
};

export type User = {
  username: string;
  emailAddress: string;
  password?: string; 
  nameOfUser: string; 
  resigterWithgoogle: boolean; 
  token: string;
  image: string | null;
  birthDay: string | null;
  address : string | null;
  phone : string | null;
};

export type UserInformation = {
  image: string | null; 
  birthDay: string;
  address : string | null;
  phone : string | null;
};
