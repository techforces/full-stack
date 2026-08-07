import { RequestHandler } from "express";

import { AUTH_COOKIE_NAME, verifyToken } from "../auth";
import { UnauthorizedError } from "../errors";

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    throw new UnauthorizedError("Not authenticated");
  }

  try {
    req.user = verifyToken(token);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }

  next();
};
