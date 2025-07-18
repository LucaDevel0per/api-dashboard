import { Request, Response, NextFunction } from "express";

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.role === 'admin') {
        return next()
    }
    return res.status(403).json({ message: "Acesso negado." })
}