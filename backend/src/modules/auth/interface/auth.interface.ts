import { ISafeUser } from "../../users/interfaces/user.interface";

export interface ICreateUserResponse {
  message: string;
  data: ISafeUser;
}

export interface ILoginInput {
  email: string;
  password: string;
}
