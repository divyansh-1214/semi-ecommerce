import type { Request, Response, NextFunction } from 'express';
import { processCSV } from '../services/import.service.js';
import fs from 'fs';

export const importCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No CSV file was uploaded",
        code: 400
      });
    }

    const filePath = req.file.path;
    console.log("Uploaded file path:", filePath);
    // Process the CSV
    const result = await processCSV(filePath);
    // Cleanup the uploaded file -- delete the file that was used
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.status(200).json({
      status: "success",
      ...(result as any)
    });
  } catch (error) {
    // Ensure cleanup happens on error as well
    console.log(error)
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  }
};
