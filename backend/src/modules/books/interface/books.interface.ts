import { Book } from "@prisma/client";

export type ICreateBookInput = Omit<
  Book,
  "id" | "coverUrl" | "coverThumbUrl" | "createdAt" | "deletedAt"
>;
export type IUpdateBookInput = Partial<ICreateBookInput> & {
  coverUrl?: string;
  coverThumbUrl?: string;
};

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

export abstract class IBookRepository {
  abstract create(data: ICreateBookInput): Promise<Book>;
  abstract findMany(query: IFindManyQuery): Promise<IFindMany>;
  abstract findById(id: string): Promise<Book | null>;
  abstract update(id: string, data: IUpdateBookInput): Promise<Book>;
  abstract delete(id: string): Promise<void>;
}
