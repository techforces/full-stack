import express from "express";
import cors from "cors";

import prisma from "./prisma";
import upload from "./multer";
import { error } from "node:console";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(
    `Server is running on  \x1b[34m${`http://localhost:${PORT}`}\x1b[0m`,
  );
});

app.get("/", async (req, res) => {
  try {
    res.json({
      message: "API connection successful!",
    });
  } catch (err) {
    console.error("Error connecting to API:", err);
    res.status(500).json({ error: "Failed to connect." });
  }
});

app.post("/create-property", upload.single("file"), async (req, res) => {
  try {
    const {
      name,
      type, //PRVT or PUB
      manager,
      accountant,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const bytes = new Uint8Array(req.file.buffer);

    if (!name || !type || !manager || !accountant) {
      return res.status(400).json({
        error: "Missing required query parameters",
      });
    }

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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create property",
    });
  }
});

app.get("/properties", async (req, res) => {
  try {
    const properties = await prisma.property.findMany();

    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch properties",
    });
  }
});

app.get("/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Property id is required" });
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: { file: true },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    return res.status(200).json(property);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch property" });
  }
});

app.get("/properties/:id/file", async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { file: true },
    });

    if (!property || !property.file) {
      return res
        .status(404)
        .json({ error: "File not found for this property" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${property.file.name}"`,
    );

    return res.send(Buffer.from(property.file.data));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to download file" });
  }
});

app.post("/create-building", async (req, res) => {
  try {
    const { street, houseNumber, otherDetails, propertyId } = req.body;

    if (!street || !houseNumber || !propertyId) {
      return res.status(400).json({
        error: "Missing street, house number and specified property",
      });
    }

    const building = await prisma.building.create({
      data: {
        street,
        houseNumber,
        otherDetails,
        propertyId,
      },
    });

    res.status(201).json(building);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create building",
    });
  }
});

app.get("/buildings", async (req, res) => {
  try {
    const buildings = await prisma.building.findMany();

    res.status(200).json(buildings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch buildings",
    });
  }
});

app.get("/buildings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Building id is required" });
    }

    const building = await prisma.building.findUnique({
      where: { id },
    });

    if (!building) {
      return res.status(404).json({ error: "Building not found" });
    }

    return res.status(200).json(building);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch building" });
  }
});

app.post("/create-unit", async (req, res) => {
  try {
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
      return res.status(400).json({
        error:
          "Missing number, type, floor, entrance, size, share, construction year, rooms or specified building",
      });
    }

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
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create unit",
    });
  }
});

app.get("/units", async (req, res) => {
  try {
    const units = await prisma.unit.findMany();
    res.status(200).json(units);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch units",
    });
  }
});

app.get("/units/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Unit id is required" });
    }

    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    return res.status(200).json(unit);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch unit" });
  }
});
