import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/forbidden.error";

export function adminOnlyMiddleware(req: Request, _res: Response, next: NextFunction) {
    try{
        const user = req.user;
        if(!user || user.role !== "ADMIN"){
            throw new ForbiddenError("Acesso negado");
        }
        next();
    }catch(error){
        next(error);
    }
}