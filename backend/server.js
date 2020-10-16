const express = require('express');
const userRoute = require('./user.js');
const app = express();

app.use(express.json());
app.use('/user', userRoute);


app.listen(8080);
