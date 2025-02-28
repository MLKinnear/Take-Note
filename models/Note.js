const mongoose = require('mongoose');

//Note Schema
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true,},
    description: { 
        type: String,
        required: [true, 'A note is required'],
        trim: true,
        minlength: [5, 'The note needs a min of 5 characters!'],
        maxlength: [500, 'That is too long, Please reduce or make this 2 notes'],
    },
    pinned: { type: Boolean, default: false,},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('note', noteSchema);
