import { Review } from "@prisma/client";

export type ICreateReviewInput = Pick<Review, "rating" | "comment">;
export interface IQueryReviewInput {
  page?: number;
  limit?: number;
}
export interface IFindManyForAdminReviewsQuery {
  page?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
}

export type ISafeReview = Omit<Review, "userId">;

export interface IPaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IFindManyByBookIdResult {
  reviews: (ISafeReview & { user: { name: string } })[];
  averageRating: number;
  totalReviews: number;
  metadata: IPaginationMetadata;
}

export interface IFindManyByUserIdResult {
  reviews: (ISafeReview & {
    book: { title: string; category: { name: string } | null; coverUrl: string | null; author: string };
  })[];
  averageRating: number;
  totalReviews: number;
}

export interface IAdminReviewItem {
  id: string;
  createdAt: Date;
  deletedAt: Date | null;
  rating: number;
  comment: string | null;
  user: { id: string; name: string; email: string };
  book: { id: string; title: string; coverThumbUrl: string | null; author: string };
}

export interface IFindManyForAdminResult {
  data: IAdminReviewItem[];
  metadata: IPaginationMetadata;
}

export abstract class IReviewRepository {
  abstract findUniqueByBookId(userId: string, bookId: string): Promise<ISafeReview | null>;
  abstract findManyByBookId(bookId: string, page?: number, limit?: number): Promise<IFindManyByBookIdResult>;
  abstract findManyByUserId(userId: string): Promise<IFindManyByUserIdResult>;
  abstract create(userId: string, bookId: string, data: ICreateReviewInput): Promise<ISafeReview>;
  abstract findById(id: string): Promise<Review | null>;
  abstract delete(bookId: string, userId: string): Promise<void>;
  abstract deleteById(id: string): Promise<void>;
  abstract findManyForAdmin(query: IFindManyForAdminReviewsQuery): Promise<IFindManyForAdminResult>;
}

