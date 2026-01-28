import { User } from "../../../database/generated/prisma";

export type ICreateUser = Omit<User, "role" | "id">;
export type ICreateUserInput = Omit<ICreateUser, "passwordHash"> & {
  password: string;
  confirmPassword: string;
};

export type ISafeUser = Omit<User, "passwordHash" | "id">;

export interface IUsersRepository {
  create(data: ICreateUser): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
