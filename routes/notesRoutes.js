const express = require('express');
const route = express.Router();
const createNote = require('../notescontroller/notescontroller.js');

route.post('/create', createNote);

module.exports = route;
