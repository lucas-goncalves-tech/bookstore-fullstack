import { inject, injectable } from "tsyringe";
import { BookRepository } from "./books.repository";
import { ICreateBookInput, IFindManyQuery, IUpdateBookInput } from "./interface/books.interface";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { StorageProvider } from "../../services/contracts/storage.contract";
import { BadRequestError } from "../../shared/errors/bad-request.error";

@injectable()
export class BookService {
  constructor(
    @inject(BookRepository) private readonly bookRepository: BookRepository,
    @inject("StorageProvider") private readonly storageService: StorageProvider,
  ) {}

  async findById(id: string) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }
    return bookExist;
  }

  async findMany(query: IFindManyQuery) {
    return await this.bookRepository.findMany(query);
  }

  async create(data: ICreateBookInput) {
    return await this.bookRepository.create(data);
  }

  async uploadCover(id: string, file: Express.Multer.File | undefined) {
    const bookExist = await this.bookRepository.findById(id);
    if (!bookExist) {
      throw new NotFoundError("Livro não encontrado");
    }
    if(!file){
      throw new BadRequestError("Arquivo não enviado", [
        {
          file: "Arquivo é obrigatório"
        }
      ])
    }
    const {fileTypeFromBuffer} = await import("file-type")
        const fileType = await fileTypeFromBuffer(file.buffer);
        const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
        if(!fileType || !ALLOWED_TYPES.includes(fileType.mime)){
            throw new BadRequestError("Tipo de imagem inválido", [
                {
                    mimeType: `Deve ser ${ALLOWED_TYPES.join(", ")}`
                }
            ])
        }
    const result = await this.storageService.uploadCover(file);

    return await this.bookRepository.update(id, {
      coverUrl: result.fullUrl,
      coverThumbUrl: result.thumbUrl,
    });
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
  }
}
