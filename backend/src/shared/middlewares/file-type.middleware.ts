import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request.error";

export async function fileTypeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const file = req.file;
  try {
    if (!file) {
      throw new BadRequestError("Arquivo não enviado", [
        {
          file: "Arquivo é obrigatório",
        },
      ]);
    }
    const { fileTypeFromBuffer } = await import("file-type");
    const fileType = await fileTypeFromBuffer(file.buffer);
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!fileType || !ALLOWED_TYPES.includes(fileType.mime)) {
      throw new BadRequestError("Tipo de imagem inválido", [
        {
          mimeType: `Deve ser ${ALLOWED_TYPES.join(", ")}`,
        },
      ]);
    }
    next();
  } catch (error) {
    next(error);
  }
}
