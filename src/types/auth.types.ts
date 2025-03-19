export interface UserSignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  age: number | string;
  verified?: boolean;
}
