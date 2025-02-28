const express = require('express');
const Note = require('../models/Note');
const { getAllNotes, getNoteById, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// Requires Authentication
router.use(isAuthenticated);

//Routes to notes list
router.get('/', getAllNotes);

//Renders notes list
router.get('/', (req, res) => {
    res.render('index')
});

//Render create view
router.get('/create', (req,res) => {
    res.render('create')
});

//Routes to specific id note
router.get('/:id', getNoteById);

//Creates a note
router.post('/create', createNote);

//Render update view
router.get('/edit/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('Note not found');
        }
        res.render('update', { note });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//Updates a note
router.put('/:id', updateNote);

//Deletes a note
router.delete('/:id', deleteNote);

module.exports = router;
