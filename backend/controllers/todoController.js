let todos = [
{ id: 1, text: "Handla mjölk", done: false },
{ id: 2, text: "Plugga CRUD", done: false },
];

const getTodos = (req, res) => {
    res.json(todos);
};

module.exports = { getTodos };
