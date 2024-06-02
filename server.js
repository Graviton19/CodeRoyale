const express = require('express');
const { compileCode } = require('./src/utils/rapidaApiSetup');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to handle code compilation and execution
app.post('/compile', compileCode);

// Start the Express.js server
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
