const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

connectDB();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./auth"));
app.use("/api/students", require("./student"));

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
