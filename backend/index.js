const express = require("express"); // importerar express

const app = express(); // skapar vår server
const PORT = 3000; // porten servern ska köra på

app.use(express.json()); // gör så att vi kan läsa JSON från requests

// test-route för att se att servern funkar
app.get("/", (req, res) => {
res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log("Servern körs på https://localhost:3000");
});

