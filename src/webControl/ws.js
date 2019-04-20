'use strict';

// code allowing webSocket to work-> kind of interface between web page and rest of js code.

const debug = require('debug')('wc:ws'); // wc for web control
const express = require('express');

const join = require('path').join;

const app = express();
require('express-ws')(app);

debug('Packages required');

const prefs = {};

app.use(express.static(join(__dirname, '/html')));

app.ws('/ws', (ws) => {
  ws.on('message', (msg) => {
    var message = JSON.parse(msg);
    // ws.send(msg);
    debug(message);
    prefs[message.event] = message.value;
    prefs.ws = ws;
  });

  ws.on('close', () => {
    console.log('WebSocket was closed');
    Object.keys(prefs).forEach((label) => (prefs[label] = null));
  });

  ws.on('connection', () => {
    console.log('WebSocket was opened');
  });
});

app.listen(80);

module.exports = prefs;
