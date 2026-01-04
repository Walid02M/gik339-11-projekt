const express = require("express");
const router = express.Router();

const { getTodos } = require("../controllers/todoController");

router.get("/", getTodos);

module.exports = router;