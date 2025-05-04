const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create a separate schema instance
const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    currentSemester: {
      type: Number,
      required: [true, "Current semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [8, "Semester cannot be more than 8"],
    },
    program: {
      type: String,
      required: [true, "Program is required"],
      enum: {
        values: ["B.Tech CSE", "B.Tech ECE", "B.Com General", "B.Com Honors"],
        message: "{VALUE} is not a valid program",
      },
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes
StudentSchema.index({ rollNumber: 1 }, { unique: true });
StudentSchema.index({ email: 1 });

// Hash password before saving
StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Student = mongoose.model("Student", StudentSchema);

// Clear all students from the database (for debugging)
router.get("/clear", async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ msg: "All students cleared from database" });
  } catch (err) {
    console.error("Error clearing students:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Received student data:", req.body);
    const { name, rollNumber, email, phoneNumber, currentSemester, program } =
      req.body;

    // Basic validation
    if (
      !name ||
      !rollNumber ||
      !email ||
      !phoneNumber ||
      !currentSemester ||
      !program
    ) {
      return res.status(400).json({
        msg: "All fields are required",
        missing: Object.entries({
          name,
          rollNumber,
          email,
          phoneNumber,
          currentSemester,
          program,
        })
          .filter(([_, value]) => !value)
          .map(([key]) => key),
      });
    }

    // Check for existing student with the same roll number
    const existingRollNumber = await Student.findOne({
      rollNumber: rollNumber.trim(),
    });
    if (existingRollNumber) {
      console.log(
        "Found existing student with roll number:",
        existingRollNumber
      );
      return res
        .status(400)
        .json({ msg: "Student with this roll number already exists" });
    }

    // Check for existing student with the same email
    const existingEmail = await Student.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingEmail) {
      console.log("Found existing student with email:", existingEmail);
      return res
        .status(400)
        .json({ msg: "Student with this email already exists" });
    }

    // Create new student with cleaned data
    const newStudent = new Student({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      currentSemester: Number(currentSemester),
      program,
      password: "presidency", // Set default password
    });

    // Save with validation
    const student = await newStudent.save();
    console.log("Student saved successfully:", student);
    res.status(201).json(student);
  } catch (err) {
    console.error("Error adding student:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return res
        .status(400)
        .json({ msg: "Validation Error", errors: validationErrors });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      console.log("Duplicate key error:", err.keyPattern);
      const field = Object.keys(err.keyPattern)[0];
      return res
        .status(400)
        .json({ msg: `Student with this ${field} already exists` });
    }

    // Handle other errors
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    await Student.deleteOne({ _id: req.params.id });
    res.json({ msg: "Student removed", id: req.params.id });
  } catch (err) {
    console.error("Error deleting student:", err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// Student login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the password matches the fixed password
    if (password !== "presidency") {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res
        .status(400)
        .json({ msg: "Student not found. Please contact admin." });
    }

    // Return student data without password
    const { password: _, ...studentData } = student.toObject();
    res.json({ success: true, student: studentData });
  } catch (err) {
    console.error("Error in student login:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// Get student profile
router.get("/profile/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.get("/results/:studentId/:semester", async (req, res) => {
  try {
    const { studentId, semester } = req.params;

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Directly find the results with the studentId
    const results = await mongoose.connection.db
      .collection("results")
      .findOne({ studentId: studentObjectId });

    if (!results) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found for this student" });
    }

    const semesterData = results.semesters.find((s) => s.semester === semester);
    if (!semesterData) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found for this semester" });
    }

    res.json({ success: true, semesterData });
  } catch (err) {
    console.error("Error fetching results:", err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});

module.exports = router;
