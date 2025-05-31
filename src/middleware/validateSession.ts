import { NextFunction, Request, Response } from "express";

const validateUserSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip middleware for /Auth/*
  if (req.path.startsWith("/Auth")) return next();
  if (!req.session || !req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
  return;
};

export default validateUserSession;
