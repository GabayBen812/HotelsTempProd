import { Request, Response } from "express";
import { prismaClient } from "../prisma";

export const upsertAiContext = async (req: Request, res: Response) => {
  try {
    const { organizationId, fileUrls, contextText } = req.body;
    if (!organizationId) {
      return res.status(400).json({ message: "Missing organizationId" });
    }

    const aiSettings = await prismaClient.aiSettings.upsert({
      where: { organizationId },
      update: {
        fileUrls: fileUrls ?? [],
        contextText,
      },
      create: {
        organizationId,
        fileUrls: fileUrls ?? [],
        contextText,
      },
    });

    res.json({ aiSettings });
  } catch (err) {
    console.error("upsertAiContext error:", err);
    res.status(500).json({ message: "Failed to upsert AI context" });
  }
};

export const fetchAiContext = async (req: Request, res: Response) => {
  try {
    const { organizationId } = req.query;
    if (!organizationId) {
      return res.status(400).json({ message: "Missing organizationId" });
    }

    const aiSettings = await prismaClient.aiSettings.findUnique({
      where: { organizationId: Number(organizationId) },
    });

    if (!aiSettings) {
      return res.status(404).json({ message: "AI settings not found" });
    }

    res.json(aiSettings);
  } catch (err) {
    console.error("fetchAiContext error:", err);
    res.status(500).json({ message: "Failed to fetch AI context" });
  }
};
