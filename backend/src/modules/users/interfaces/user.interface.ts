import { User } from "@prisma/client";

export type ICreateUser = Omit<User, "role" | "id">;
export type ICreateUserInput = Omit<ICreateUser, "passwordHash"> & {
  password: string;
  confirmPassword: string;
};

export type ISafeUser = Omit<User, "passwordHash" | "id">;

export abstract class IUsersRepository {
  abstract create(data: ICreateUser): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
