import { Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
