const express = require("express");
const router = express.Router();

const { getTodos, addTodo, updateTodo } = require("../controllers/todoController");

// GET /api/todos
router.get("/", getTodos);

// POST /api/todos
router.post("/", addTodo);

// PUT /api/todos/:id
router.put("/:id", updateTodo);


module.exports = router;
