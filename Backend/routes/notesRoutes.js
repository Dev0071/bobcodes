const express = require('express');
const route = express.Router();
const { createNote, getNotes } = require('../notescontroller/notescontroller.js');

route.post('/create', createNote);
route.get('/all', getNotes);

module.exports = route;
