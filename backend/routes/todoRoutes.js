const express = require("express");
const router = express.Router();

const { getTodos, addTodo } = require("../controllers/todoController");

// GET /api/todos
router.get("/", getTodos);

// POST /api/todos
router.post("/", addTodo);

module.exports = router;