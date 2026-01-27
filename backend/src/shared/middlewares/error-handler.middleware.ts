import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/base.error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BaseError) {
    return res
      .status(err.statusCode)
      .json({
        message: err.message,
        ...(err.errors ? { errors: err.errors } : {}),
      });
  }
  //eslint-disable-next-line
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};
