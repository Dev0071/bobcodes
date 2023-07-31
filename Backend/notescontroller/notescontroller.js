const { DB } = require('../database/helpers/index.js');
const { v4: uuidv4 } = require('uuid');

const createNote = async (req, res) => {
	try {
		const id = uuidv4();
		const createdAt = new Date();
		const { content, title } = req.body;

		await DB.exec('createNote', { id, content, title, createdAt });

		res.status(201).json({ message: 'Note created successfully' });
	} catch (error) {
		console.log('Error creating the note:', error.message);
		res.status(500).json({ message: 'Failed to create note' });
	}
};

const getNotes = async (req, res) => {
	try {
		const response = (await DB.exec('getNotes')).recordset;
		console.log(response);
		res.status(200).json(response);
	} catch (error) {
		console.log('Error creating the note:', error.message);
		res.status(500).json({ message: 'Failed to get notes' });
	}
};

module.exports = { createNote, getNotes };
