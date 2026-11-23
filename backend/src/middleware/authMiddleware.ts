import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";


// Types

interface AuthenicationRequest extends Request {
    user?: string | JwtPayload;
}


// Token Authetication

const authenticateToken = (
    req: AuthenicationRequest, 
    res: Response, 
    next: NextFunction
): void => {
    const authHeader: string | undefined = req.headers["authorization"];
    const token: string | null | undefined = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if(!token) {
        res.status(401).json({ message: "Authetication token required."});
        return;
    }

    const decoded: string | JwtPayload = jwt.verify(token, String(process.env.JWT_SECRET));    
    if(!decoded) {
        res.status(401).json({ message: "Access denied."});
        return;
    }

    req.user = decoded;
    next();
}


// Exports

export { authenticateToken };
