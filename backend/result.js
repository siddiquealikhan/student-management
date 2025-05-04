const express = require("express");
const mongoose = require("mongoose");


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


const Result = mongoose.model("Result", ResultSchema);


const router = express.Router();


router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params; // Extract studentId from URL parameters

    
    const result = await Result.findOne({ studentId });

    if (!result) {
      return res.status(404).json({
        success: false,
        msg: "Results not found for this student",
      });
    }


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
