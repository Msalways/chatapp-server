export interface UserModel {
  email: string;
}

export interface User extends UserModel {
  id: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}
