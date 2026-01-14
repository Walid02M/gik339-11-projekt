let todos = [
  { id: 1, text: "Handla mjölk", done: false },
  { id: 2, text: "Plugga CRUD", done: false },
];

const getTodos = (req, res) => {
  res.json(todos);
};

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

const updateTodo = (req, res) => {
  const id = Number(req.params.id);
  const { text, done } = req.body;

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo hittades inte" });
  }

  if (text !== undefined) todo.text = text;
  if (done !== undefined) todo.done = done;

  res.json(todo);
};

const deleteTodo = (req, res) => {
  const id = Number(req.params.id);

  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Todo hittades inte" });
  }

  const removed = todos.splice(index, 1);
  res.json({ message: "Todo borttagen", removed: removed[0] });
};

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
