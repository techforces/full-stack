import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import prisma from "./prisma";
import upload from "./multer";
import logger from "./logger";
import authRouter from "./routes/auth";
import { requireAuth } from "./middleware/requireAuth";
import { BadRequestError, NotFoundError } from "./errors";
import { errorHandler, notFoundHandler } from "./errorHandler";

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      },
      "request completed",
    );
  });
  next();
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

app.get("/", async (req, res) => {
  res.json({
    message: "API connection successful!",
  });
});

app.use("/auth", authRouter);

app.post(
  "/create-property",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    const {
      name,
      type, //PRVT or PUB
      manager,
      accountant,
    } = req.body;

    if (!req.file) {
      throw new BadRequestError("File is required");
    }

    const bytes = new Uint8Array(req.file.buffer);

    if (!name || !type || !manager || !accountant) {
      throw new BadRequestError("Missing required query parameters");
    }

    logger.debug({ name, type, manager, accountant }, "creating property");

    const property = await prisma.property.create({
      data: {
        name,
        type,
        manager,
        accountant,
        owner: { connect: { id: req.user!.userId } },
        file: {
          create: {
            name: req.file.originalname,
            data: bytes,
          },
        },
      },
      include: {
        file: true,
      },
    });

    res.status(201).json(property);
  },
);

app.get("/properties", requireAuth, async (req, res) => {
  const properties = await prisma.property.findMany({
    where: { ownerId: req.user!.userId },
  });

  res.status(200).json(properties);
});

app.get("/properties/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Property id is required");
  }

  const property = await prisma.property.findFirst({
    where: { id, ownerId: req.user!.userId },
    include: { file: true },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  res.status(200).json(property);
});

app.get("/properties/:id/file", requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Property id is required");
  }

  const property = await prisma.property.findFirst({
    where: { id, ownerId: req.user!.userId },
    include: { file: true },
  });

  if (!property || !property.file) {
    throw new NotFoundError("File not found for this property");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${property.file.name}"`,
  );

  res.send(Buffer.from(property.file.data));
});

app.post("/create-building", requireAuth, async (req, res) => {
  const { street, houseNumber, otherDetails, propertyId } = req.body;

  if (!street || !houseNumber || !propertyId) {
    throw new BadRequestError(
      "Missing street, house number and specified property",
    );
  }

  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: req.user!.userId },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  logger.debug({ street, houseNumber, propertyId }, "creating building");

  const building = await prisma.building.create({
    data: {
      street,
      houseNumber,
      otherDetails,
      propertyId,
    },
  });

  res.status(201).json(building);
});

app.get("/buildings", requireAuth, async (req, res) => {
  const buildings = await prisma.building.findMany({
    where: { property: { ownerId: req.user!.userId } },
  });

  res.status(200).json(buildings);
});

app.get("/buildings/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Building id is required");
  }

  const building = await prisma.building.findFirst({
    where: { id, property: { ownerId: req.user!.userId } },
  });

  if (!building) {
    throw new NotFoundError("Building not found");
  }

  res.status(200).json(building);
});

app.post("/create-unit", requireAuth, async (req, res) => {
  const {
    number,
    type,
    floor,
    entrance,
    size,
    share,
    constructionYear,
    rooms,
    buildingId,
  } = req.body;

  if (
    !number ||
    !type ||
    !floor ||
    !entrance ||
    !size ||
    !share ||
    !constructionYear ||
    !rooms ||
    !buildingId
  ) {
    throw new BadRequestError(
      "Missing number, type, floor, entrance, size, share, construction year, rooms or specified building",
    );
  }

  const building = await prisma.building.findFirst({
    where: { id: buildingId, property: { ownerId: req.user!.userId } },
  });

  if (!building) {
    throw new NotFoundError("Building not found");
  }

  logger.debug({ number, type, buildingId }, "creating unit");

  const unit = await prisma.unit.create({
    data: {
      number,
      type,
      floor,
      entrance,
      size,
      share,
      constructionYear,
      rooms,
      buildingId,
    },
  });

  res.status(201).json(unit);
});

app.get("/units", requireAuth, async (req, res) => {
  const units = await prisma.unit.findMany({
    where: { building: { property: { ownerId: req.user!.userId } } },
  });
  res.status(200).json(units);
});

app.get("/units/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Unit id is required");
  }

  const unit = await prisma.unit.findFirst({
    where: { id, building: { property: { ownerId: req.user!.userId } } },
  });

  if (!unit) {
    throw new NotFoundError("Unit not found");
  }

  res.status(200).json(unit);
});

app.use(notFoundHandler);
app.use(errorHandler);
