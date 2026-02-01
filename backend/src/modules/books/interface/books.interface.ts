import { Book } from "@prisma/client";

export type ICreateBookInput = Omit<Book, "id" | "coverUrl" |"createdAt" | "deletedAt">;
export interface IFindManyQuery {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface IFindMany {
  data: Book[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type IUpdateBookInput = Partial<ICreateBookInput>;

export interface IBookRepository {
  create(data: ICreateBookInput): Promise<Book>;
  findMany(query: IFindManyQuery): Promise<IFindMany>;
  findById(id: string): Promise<Book | null>;
  update(id: string, data: IUpdateBookInput): Promise<Book>;
  delete(id: string): Promise<void>;
}
