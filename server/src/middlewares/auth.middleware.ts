import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../modules/users/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const AuthorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decodedToken as IUser;
    next();
  } catch (error) {
    console.error("Error in authorization middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
