import Express from "express";
import prisma from "./config/database.js";
import multer from "multer";
import { configDotenv } from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
configDotenv();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// for allowing the cors
const f_url = process.env.FRONTEND_URL || "http://localhost:3000"; ;
app.use(cors({ origin: [f_url] }));

app.get("/", (req, res) => {
  res.json({ "message": "heyy" });
})

app.use("/api", routes);

app.use(errorHandler);


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
