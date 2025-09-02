const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// JSON parsing
app.use(express.json());

// Import routes
const routes = require('./routes');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
