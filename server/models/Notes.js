const mongoose = require('mongoose');

const NoteSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  tag: {
    type: String,
    deault: general,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('notes', UserSchemas);
