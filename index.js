const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db.connection");
const { Student } = require("./models/students.model");

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
initializeDatabase();

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Student Management API Running 🚀");
});

// ================= GET ALL STUDENTS =================
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= ADD STUDENT =================
app.post("/students", async (req, res) => {
  try {
    const { name, age } = req.body;

    // ✅ Basic validation
    if (!name || !age) {
      return res.status(400).json({ error: "Name and Age are required" });
    }

    // ✅ Accept all fields
    const newStudent = new Student(req.body);

    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ================= UPDATE STUDENT =================
app.put("/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body, // ✅ updates all fields
      { new: true },
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= DELETE STUDENT =================
app.delete("/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
