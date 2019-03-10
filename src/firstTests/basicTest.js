// program that allows to make a servo sweep back and forth using RPi

const express = require('express');
const app = express();
const join = require('path').join;

app.use(express.static(join(__dirname, '/html')));
app.listen(80);
