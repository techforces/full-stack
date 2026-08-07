import { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@prisma/client";

import logger from "./logger";
import { AppError, NotFoundError } from "./errors";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with this value already exists";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003":
        statusCode = 400;
        message = "Invalid reference to a related record";
        break;
      default:
        statusCode = 400;
        message = "Database request error";
    }
  }

  const logFields = {
    err,
    statusCode,
    method: req.method,
    url: req.originalUrl,
  };

  if (statusCode >= 500) {
    logger.error(logFields, message);
  } else {
    logger.warn(logFields, message);
  }

  res.status(statusCode).json({ error: message });
};
