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


  // enkel koll så text finns
  if (!text) {
    return res.status(400).json({ message: "Du måste skicka med text" });
  }

  const newTodo = {
    id: todos.length + 1,
    text: text,
    done: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo); // 201 = skapad
};

module.exports = { getTodos, addTodo };
