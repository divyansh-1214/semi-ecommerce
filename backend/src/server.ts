import Express from "express";
import prisma from "./config/database.js";
import multer from "multer";
import { configDotenv } from "dotenv";
import cors from "cors";
const app = Express();
const upload = multer({ dest: 'uploads/' })
configDotenv();

// for allowing the cors
const f_url = process.env.FRONTEND_URL || "http://localhost:3000"; ;
app.use(cors({ origin: [f_url] }));

app.get("/", (req, res) => {
  res.json({ "message": "heyy" });
})

app.post(
  "/upload",
  upload.single("doc"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file was uploaded",
      });
    }

    console.log(req.file);

    return res.status(200).json({
      message: "File uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  }
);


async function  startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
  }
  catch (error) {
    console.error("Failed to connect to the database:", error);
  }
  app.listen(process.env.PORT || 5000, () => {
    console.log("server is stated at http://localhost:5000");
  })
}
startServer()
