import { NextFunction, Request, Response } from "express";
import { SID_COOKIE } from "../contants/sid-cookie";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { verifyToken } from "../secutiry/token.service";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    try{
        const token = req.cookies[SID_COOKIE]
        if(!token){
            throw new UnauthorizedError("Token inválido ou ausente")
        }
        
        const user = verifyToken(token);
        req.user = user;
        next();
    }catch(error){
        next(error);
    }
}