const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:     { type: String, required: true },
  completed:{ type: Boolean, default: false },
  category: { type: String, enum: ['Work', 'Personal', 'Study', 'Health', 'Other'], default: 'Other' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate:  { type: Date },
  reminder: { type: Date },
  type:     { type: String, enum: ['one-time', 'daily'], default: 'one-time' },
  streakCount: { type: Number, default: 0 },
  lastCompletedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);
