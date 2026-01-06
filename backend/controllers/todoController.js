// enkel "fake-databas" i minnet
let todos = [
  { id: 1, text: "Handla mjölk", done: false },
  { id: 2, text: "Plugga CRUD", done: false },
];

// GET: hämtar alla todos
const getTodos = (req, res) => {
  res.json(todos);
};

// POST: lägger till en ny todo
const addTodo = (req, res) => {
  const text = req.body?.text;

  if (!text) {
    return res.status(400).json({ message: "Du måste skicka med text" });
  }

  const newTodo = {
    id: todos.length + 1,
    text: text,
    done: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// PUT: uppdaterar en todo
const updateTodo = (req, res) => {
  const id = Number(req.params.id);
  const { text, done } = req.body;

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo hittades inte" });
  }

  if (text !== undefined) {
    todo.text = text;
  }

  if (done !== undefined) {
    todo.done = done;
  }

  res.json(todo);
};

module.exports = { getTodos, addTodo, updateTodo };
