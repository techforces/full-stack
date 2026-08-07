import { Router } from "express";
import { User } from "@prisma/client";

import prisma from "../prisma";
import logger from "../logger";
import {
  hashPassword,
  verifyPassword,
  signToken,
  AUTH_COOKIE_NAME,
  authCookieOptions,
} from "../auth";
import { requireAuth } from "../middleware/requireAuth";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";

const router = Router();

function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  logger.debug({ email }, "creating user");

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const token = signToken({ userId: user.id });

  res
    .status(201)
    .cookie(AUTH_COOKIE_NAME, token, authCookieOptions)
    .json({ user: toPublicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signToken({ userId: user.id });

  res
    .status(200)
    .cookie(AUTH_COOKIE_NAME, token, authCookieOptions)
    .json({ user: toPublicUser(user) });
});

router.post("/logout", requireAuth, (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions).status(204).send();
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json({ user: toPublicUser(user) });
});

export default router;
