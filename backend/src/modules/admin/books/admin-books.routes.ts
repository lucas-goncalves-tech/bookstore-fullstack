import "./admin-books.doc";

import { Router } from "express";
import { container, injectable } from "tsyringe";
import { BookController } from "../../books/books.controller";
import { validateMiddleware } from "../../../shared/middlewares/validate.middleware";
import { createBookDto, updateBookDto } from "../../books/dtos/book.dto";
import { bookParamsDto } from "../../books/dtos/book-params";
import { uploadMiddleware } from "../../../shared/middlewares/upload.middleware";
import { fileTypeMiddleware } from "../../../shared/middlewares/file-type.middleware";

@injectable()
export class AdminBooksRoutes {
  private readonly router = Router();
  private readonly controller = container.resolve(BookController);

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post(
      "/",
      validateMiddleware({ body: createBookDto }),
      this.controller.create,
    );
    this.router.post(
      "/:id/cover",
      validateMiddleware({ params: bookParamsDto }),
      uploadMiddleware.single("cover"),
      fileTypeMiddleware,
      this.controller.uploadCover,
    );
    this.router.put(
      "/:id",
      validateMiddleware({ params: bookParamsDto, body: updateBookDto }),
      this.controller.update,
    );
    this.router.delete(
      "/:id",
      validateMiddleware({ params: bookParamsDto }),
      this.controller.delete,
    );
  }

  get routes() {
    return this.router;
  }
}
