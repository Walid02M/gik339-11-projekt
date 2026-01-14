const cors = require("cors");
const productsRoutes = require("./routes/productsRoutes");

const express = require("express"); // importerar express

const app = express(); // skapar vår server
const PORT = 3000; // porten servern ska köra på

app.use(express.json()); // gör så att vi kan läsa JSON från requests

app.use(cors());


const todoRoutes = require("./routes/todoRoutes"); // hämtar våra todo-routes

// test-route för att se att servern funkar
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// kopplar in todo-routes: /api/todos
app.use("/api/todos", todoRoutes);

app.use("/products", productsRoutes);


app.listen(PORT, () => {
  console.log("Servern körs på http://localhost:3000");
});
