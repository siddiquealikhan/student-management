const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const mongoose = require("mongoose");
const resultRoutes = require("./result"); 

console.log("Starting server...");


connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");

    console.log("→ ACTIVE DB:", mongoose.connection.name);
    mongoose.connection.db
      .listCollections()
      .toArray()
      .then((cols) =>
        console.log(
          "→ Collections in active DB:",
          cols.map((c) => c.name)
        )
      )
      .catch((err) => console.error("Error listing collections:", err));

    const app = express();

    // Middleware
    app.use(express.json());
    app.use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

   
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      if (req.method === "POST") {
        console.log("Request body:", JSON.stringify(req.body, null, 2));
      }
      next();
    });

    
    app.use("/api/auth", require("./auth"));
    app.use("/api/students", require("./student"));

    // Use the result routes defined in result.js
    app.use("/api/results", resultRoutes); // This line uses the result routes

    app.get("/", (req, res) => {
      res.send("API Running");
    });

   
    app.use((err, req, res, next) => {
      console.error("Global error handler:", err);
      console.error("Error stack:", err.stack);
      res.status(500).json({
        msg: "Server Error",
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    });

    const PORT = process.env.PORT || 5002;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(
        `MongoDB connection status: ${
          mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
        }`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });
