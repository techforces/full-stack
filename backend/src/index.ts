import express from "express";
import cors from "cors";

import prisma from "./prisma";
import upload from "./multer";
import logger from "./logger";
import { BadRequestError, NotFoundError } from "./errors";
import { errorHandler, notFoundHandler } from "./errorHandler";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.post("/create-property", upload.single("file"), async (req, res) => {
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
});

app.get("/properties", async (req, res) => {
  const properties = await prisma.property.findMany();

  res.status(200).json(properties);
});

app.get("/properties/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Property id is required");
  }

  const property = await prisma.property.findUnique({
    where: { id },
    include: { file: true },
  });

  if (!property) {
    throw new NotFoundError("Property not found");
  }

  res.status(200).json(property);
});

app.get("/properties/:id/file", async (req, res) => {
  const { id } = req.params;

  const property = await prisma.property.findUnique({
    where: { id },
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

app.post("/create-building", async (req, res) => {
  const { street, houseNumber, otherDetails, propertyId } = req.body;

  if (!street || !houseNumber || !propertyId) {
    throw new BadRequestError(
      "Missing street, house number and specified property",
    );
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

app.get("/buildings", async (req, res) => {
  const buildings = await prisma.building.findMany();

  res.status(200).json(buildings);
});

app.get("/buildings/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Building id is required");
  }

  const building = await prisma.building.findUnique({
    where: { id },
  });

  if (!building) {
    throw new NotFoundError("Building not found");
  }

  res.status(200).json(building);
});

app.post("/create-unit", async (req, res) => {
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

app.get("/units", async (req, res) => {
  const units = await prisma.unit.findMany();
  res.status(200).json(units);
});

app.get("/units/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Unit id is required");
  }

  const unit = await prisma.unit.findUnique({
    where: { id },
  });

  if (!unit) {
    throw new NotFoundError("Unit not found");
  }

  res.status(200).json(unit);
});

app.use(notFoundHandler);
app.use(errorHandler);
