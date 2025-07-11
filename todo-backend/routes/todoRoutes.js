const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get ".jpg"
    cb(null, `${Date.now()}${ext}`); // result: 1720356575613.jpg
  },
});

const upload = multer({ storage });




// File upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, category, priority, tags } = req.body;

    if (!title?.trim() || !priority?.trim()) {
  return res.status(400).json({ error: "Missing required fields" });
}


    const newTodo = new Todo({
  title,
  category,
  priority: priority.toLowerCase(), // ✅ this ensures it's always lowercase
  tags: tags ? tags.split(",").map((t) => t.trim()) : [],
  filePath: req.file ? `/uploads/${req.file.filename}` : "",
});

    await newTodo.save();

    res.status(200).json({
      message: "Task created with optional file",
      todo: newTodo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File upload failed" });
  }
});



// Get all
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch {
    res.status(500).json({ error: "Fetching failed" });
  }
});

// Add
router.post("/", async (req, res) => {
  try {
    const { title, category, priority, tags } = req.body;
    if (!title || !priority || !Array.isArray(tags)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTodo = new Todo({ title, category, priority, tags });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Update (for toggle)
router.put("/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update" });
  }
});
// GET stats: total, completed, pending
router.get("/stats", async (req, res) => {
  try {
    const total = await Todo.countDocuments({});
    const completed = await Todo.countDocuments({ completed: true });
    const pending = total - completed;
    res.json({ total, completed, pending });
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// GET /api/todos/category-count
router.get("/category-count", async (req, res) => {
  try {
    const counts = await Todo.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    res.json(counts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to count by category" });
  }
});

router.get("/stats/priority", async (req, res) => {
  try {
    const counts = await Todo.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {};
    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch priority stats" });
  }
});



module.exports = router;
