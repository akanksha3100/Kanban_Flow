const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Open', 'Overdue', 'Resolved', 'Closed'],
    required: true
  }
});

itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
