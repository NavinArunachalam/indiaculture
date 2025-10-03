const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mobile', 'whatsapp'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[\+]?[0-9]{6,15}$/, // simple international-friendly pattern
  },
  skinType: {
    type: String,
    required: true,
    enum: ['Oily', 'Dry', 'Sensitive', 'Combination'],
  },
  skinConcern: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved', 'closed'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// update updatedAt
contactRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
contactRequestSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

contactRequestSchema.index({ status: 1 });
contactRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
