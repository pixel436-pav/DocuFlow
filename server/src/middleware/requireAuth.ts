import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const requireAuth = (req:AuthRequest,res:Response,next:NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: "Acces denied. No token provided." })
  
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    req.user = decoded;
    
    next();
  } catch (e) {
    console.error(e)
    res.status(500).json({message:"Invalid Token"})
  }
};
