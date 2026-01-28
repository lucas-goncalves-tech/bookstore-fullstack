import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "../errors/bad-request.error";

interface Schemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validateMiddleware = (schemas: Schemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        schemas.body.parse(req.body);
      }
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.query) {
        schemas.query.parse(req.query);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestError("Dados inválidos", err);
      }
      throw err;
    }
  };
};
