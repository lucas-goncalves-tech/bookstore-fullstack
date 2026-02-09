import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/base.error";
import multer from "multer";
import { SessionError } from "../errors/session.error";
import {
  SID_ACCESS_COOKIE,
  SID_ACCESS_COOKIE_OPTIONS,
  SID_REFRESH_COOKIE,
  SID_REFRESH_COOKIE_OPTIONS,
} from "../contants/sid-cookie";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SessionError) {
    res.clearCookie(SID_ACCESS_COOKIE, SID_ACCESS_COOKIE_OPTIONS(0));
    res.clearCookie(SID_REFRESH_COOKIE, SID_REFRESH_COOKIE_OPTIONS(0));
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Arquivo excede o tamanho máximo de 5MB" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Tipo de arquivo inválido" });
    }
    return res.status(400).json({ message: err.message });
  }
  //eslint-disable-next-line
  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
};
