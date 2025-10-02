const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  offerLine: {
    type: String,
    required: [true, 'Offer description is required'],
    trim: true,
    maxlength: [200, 'Offer description cannot exceed 200 characters'],
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'At least one product is required'],
  }],
  image: {
    type: {
      public_id: String,
      url: String,
    },
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

OfferSchema.pre('validate', function(next) {
  if (!this.products || this.products.length === 0) {
    this.invalidate('products', 'At least one product is required');
  }
  next();
});

OfferSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Offer', OfferSchema);