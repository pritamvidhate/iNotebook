const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// get all notes using Get
router.get('/getnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal server error');
  }
});

// add all notes using Post
router.post(
  '/addnote',
  fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body(
      'description',
      'description must be at least more than 5 chars'
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server error');
    }
  }
);

// Update existing notes by using post or put
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  //create newNote object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }
  //Find the note to be updated and update it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(401).send('not found');
  }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send('not Allowed');
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.send({ note });
});
module.exports = router;
