// Importing express module
const express = require('express');

// Creating express app
const app = express();

// Defining a port
const PORT = process.env.PORT || 3000;

// Creating a basic route
app.get('/', (req, res) => {
    res.send('Hello, Backend is working!');
});

// Making the app listen on the port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
