const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  currentSemester: {
    type: Number,
    required: true,
  },
  program: {
    type: String,
    required: true,
    enum: ["B.Tech CSE", "B.Tech ECE", "B.Com General", "B.Com Honors"],
  },
});

const Student = mongoose.model("Student", StudentSchema);

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, rollNumber, email, phoneNumber, currentSemester, program } =
      req.body;

    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res
        .status(400)
        .json({ msg: "Student with this roll number already exists" });
    }

    const newStudent = new Student({
      name,
      rollNumber,
      email,
      phoneNumber,
      currentSemester,
      program,
    });

    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    await Student.deleteOne({ _id: req.params.id });
    res.json({ msg: "Student removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
