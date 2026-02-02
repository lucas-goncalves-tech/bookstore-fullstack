import { container, injectable } from "tsyringe";
import { BookController } from "./books.controller";
import { Router } from "express";
import { validateMiddleware } from "../../shared/middlewares/validate.middleware";
import { bookQueryDto } from "./dtos/book-query.dto";
import { createBookDto, updateBookDto } from "./dtos/book.dto";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { adminOnlyMiddleware } from "../../shared/middlewares/admin-only.middleware";
import { bookParamsDto } from "./dtos/book-params";
import { uploadMiddleware } from "../../shared/middlewares/upload.middleware";
import { fileTypeMiddleware } from "../../shared/middlewares/file-type.middleware";

@injectable()
export class BookRoutes {
  private readonly controller: BookController;
  private readonly router: Router;
  constructor() {
    this.controller = container.resolve(BookController);
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/",
      validateMiddleware({ query: bookQueryDto }),
      this.controller.findMany,
    );
    this.router.get(
      "/:id",
      validateMiddleware({ params: bookParamsDto }),
      this.controller.findById,
    );
    this.router.post(
      "/",
      authMiddleware,
      adminOnlyMiddleware,
      validateMiddleware({ body: createBookDto }),
      this.controller.create,
    );
    this.router.post(
      "/:id/cover",
      authMiddleware,
      adminOnlyMiddleware,
      validateMiddleware({ params: bookParamsDto }),
      uploadMiddleware.single("cover"),
      fileTypeMiddleware,
      this.controller.uploadCover,
    );
    this.router.put(
      "/:id",
      authMiddleware,
      adminOnlyMiddleware,
      validateMiddleware({ params: bookParamsDto, body: updateBookDto }),
      this.controller.update,
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      adminOnlyMiddleware,
      validateMiddleware({ params: bookParamsDto }),
      this.controller.delete,
    );
  }

  get routes() {
    return this.router;
  }
}
