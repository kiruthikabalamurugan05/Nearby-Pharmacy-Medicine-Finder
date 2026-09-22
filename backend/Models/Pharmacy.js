const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    licenseNumber: {
      type: String,
      required: true
    },

    licenseDocument: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pharmacy', pharmacySchema);