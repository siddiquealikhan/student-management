const express = require("express");
const mongoose = require("mongoose");

// Define the Result schema
const ResultSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: [
    {
      name: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        required: true,
      },
    },
  ],
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
});

// Create the Result model
const Result = mongoose.model("Result", ResultSchema);

// Initialize Express router
const router = express.Router();

// GET route to fetch result by studentId
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params; // Extract studentId from URL parameters

    // Query the database for the result of the student
    const result = await Result.findOne({ studentId });

    if (!result) {
      return res.status(404).json({
        success: false,
        msg: "Results not found for this student",
      });
    }

    // Send the result back as JSON
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
});

// Export the router to use it in server.js
module.exports = router;
