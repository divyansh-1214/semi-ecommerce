import Express from "express";
import prisma from "./config/database.js";
const app = Express();
app.get("/", (req, res) => {
  res.json({ "message": "heyy" });
})

async function  startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully");
  }
  catch (error) {
    console.error("Failed to connect to the database:", error);
  }
  app.listen(5000, () => {
    console.log("server is stated at http://localhost:5000");
  })
}
startServer()
