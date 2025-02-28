const Note = require('../models/Note');

//getAllNotes
const getAllNotes = async (req, res) =>{
    try{
        const notes = await Note.find({ user: req.user.id}).sort({ pinned: -1 });
        res.render('index', {notes});
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};


//Renders note view
const getNoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).send('Note not found');
        }
        res.render('note', { note });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

//createNote
const createNote = async (req, res) => {
    const {title, description, pinned} = req.body;
    try{
        const newNote = new Note({
            title,
            description,
            pinned: pinned === 'true',
            user: req.user.id
        });
        
        await newNote.save()
        res.redirect('/notes');
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            return res.render('create', { errorMessage: err.errors.description.message });
        }
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

//updateNote
const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, description, pinned } = req.body;

    try {
        const note = await Note.findByIdAndUpdate(
            { _id: id, user: req.user.id},
            { title, description, pinned: pinned === 'true' },
            { new: true, runValidators: true }
        );
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.redirect('/notes');

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.render('update', { 
                note: { _id: id, title, description, pinned },
                errorMessage: err.errors.description.message
            });
        }
        res.status(500).json({ error: 'Server Error' });
    }
}

//deleteNote
const deleteNote = async (req, res) => {
    try{
        const { id } = req.params;
        const note = await Note.findByIdAndDelete({ _id: id, user: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Note not found'});
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error'});
    }
};

module.exports = {getAllNotes, getNoteById, createNote, updateNote, deleteNote};