const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const { router } = require('./routes');
app.use('/', router);

app.listen(PORT,()=>console.log(`JUKE running on port ${PORT}`));
