import type { Request, Response, NextFunction } from 'express';
import { processCSV } from '../services/import.service.js';

export const importCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No CSV file was uploaded",
        code: 400
      });
    }

    const fileBuffer = req.file.buffer;
    console.log("Uploaded file size:", fileBuffer.length, "bytes");

    // Process the CSV directly from memory buffer
    const result = await processCSV(fileBuffer);

    res.status(200).json({
      status: "success",
      ...(result as any)
    });
  } catch (error) {
    console.error("Import error:", error);
    next(error);
  }
};
