import { inject, injectable } from "tsyringe";
import { BookRepository } from "./books.repository";
import {
  ICreateBookInput,
  IFindManyQuery,
  IUpdateBookInput,
} from "./interface/books.interface";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { StorageProvider } from "../../services/contracts/storage.contract";

@injectable()
export class BookService {
  constructor(
    @inject(BookRepository) private readonly bookRepository: BookRepository,
    @inject("StorageProvider") private readonly storageService: StorageProvider,
  ) {}

  private async deleteWithRetries(url: string, maxRetries = 3, delay = 1000) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        await this.storageService.deleteFile(url);
        return;
      } catch (error) {
        if (i === maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private async cleanupOldCover(coverUrl: string, coverThumbUrl: string) {
    await Promise.allSettled([
      this.deleteWithRetries(coverUrl),
      this.deleteWithRetries(coverThumbUrl),
    ]);
  }

  async findById(id: string) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }
    return bookExist;
  }

  async findMany(query: IFindManyQuery) {
    const data = await this.bookRepository.findMany(query);
    const dataWithRatings = data.data.map((book) => {
      const { review, ...bookData } = book;
      const averageRating =
        review.length > 0
          ? review.reduce((acc, r) => acc + r.rating, 0) / review.length
          : 0;

      return {
        ...bookData,
        averageRating: Number(averageRating.toFixed(1)),
      };
    });

    return {
      data: dataWithRatings,
      metadata: data.metadata,
    };
  }

  async create(data: ICreateBookInput) {
    return await this.bookRepository.create(data);
  }

  async uploadCover(id: string, file: Express.Multer.File) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }
    const oldCoverUrl = bookExist.coverUrl;
    const oldCoverThumbUrl = bookExist.coverThumbUrl;

    const result = await this.storageService.uploadCover(file);

    if (oldCoverUrl && oldCoverThumbUrl) {
      this.cleanupOldCover(oldCoverUrl, oldCoverThumbUrl).catch((error) => {
        //eslint-disable-next-line no-console
        console.error(
          "Error ao deletar imagens antigas durante upload:",
          error,
        );
      });
    }

    await this.bookRepository.update(id, {
      coverUrl: result.fullUrl,
      coverThumbUrl: result.thumbUrl,
    });

    return {
      coverUrl: result.fullUrl,
      coverThumbUrl: result.thumbUrl,
    };
  }

  async update(id: string, data: IUpdateBookInput) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }
    return await this.bookRepository.update(id, data);
  }

  async delete(id: string) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }

    await this.bookRepository.delete(id);

    if (bookExist.coverUrl && bookExist.coverThumbUrl) {
      this.cleanupOldCover(bookExist.coverUrl, bookExist.coverThumbUrl).catch(
        (error) => {
          //eslint-disable-next-line no-console
          console.error(
            "Error ao deletar imagens durante deleção do livro:",
            error,
          );
        },
      );
    }
  }
}
