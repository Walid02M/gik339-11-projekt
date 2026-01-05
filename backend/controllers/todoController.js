// enkel "fake-databas" i minnet för att lära oss CRUD
let todos = [
{ id: 1, text: "Handla mjölk", done: false },
{ id: 2, text: "Plugga CRUD", done: false },
];

// GET: hämtar alla todos
const getTodos = (req, res) => {
    res.json(todos);
};

// POST: Lägger till en ny todo
const addTodo = (req, res) => {
    //tar text från body (det vi skickar in)
    const text = req.body.text;

    // enkel koll så man inte skickar tom text
    if (!text) {
        return res.status(400).json({ message: "Du måste skicka med text" });
    }

    const newTodo = {
        id: todos.length + 1, // enkel id-lösning (räcker för nu)
        text: text,
        done: false,
        };

        todos.push(newTodo);
        res.status(201).json(newTodo); // 201= skapad
    };

module.exports = { getTodos, addTodo };


