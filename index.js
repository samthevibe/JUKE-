// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// JSON parsing
app.use(express.json());

// Import routes
const { router } = require('./routes');
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

