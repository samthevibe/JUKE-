const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const { router } = require('./routes');
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

