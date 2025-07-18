import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    
    jwt.verify(token, JWT_SECRET!, (err, user) => { 
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado'});
        }

        // @ts-ignore
        req.user = user;
        next()
    })
}