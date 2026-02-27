import { User } from "@prisma/client";

export type ICreateUser = Pick<User, "email" | "name" | "passwordHash">;
export type ICreateUserInput = Omit<ICreateUser, "passwordHash"> & {
  password: string;
  confirmPassword: string;
};

export type ISafeUser = Omit<User, "passwordHash" | "id">;
export interface IFindManyForAdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  order: "asc" | "desc";
}

export abstract class IUsersRepository {
  abstract create(data: ICreateUser): Promise<User>;
  abstract findByKey(key: "id" | "email", value: string): Promise<User | null>;
  abstract findManyforAdmin(query: IFindManyForAdminQuery): Promise<{
    data: Omit<User, "passwordHash">[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
}
