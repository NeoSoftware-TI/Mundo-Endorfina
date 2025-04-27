import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
    user?: { id: number; tipo: string };
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: number; tipo: string };
    }
  }
}