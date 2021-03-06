const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const revSchema = new Schema({
  name: String,
  date: Date,
  address: String,
  localArea: String,
  molotovScale: Number,
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  manifesto: String,
  creator: {type: Schema.Types.ObjectId, ref: 'User'}

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

revSchema.index({location: '2dsphere'});

const Revolution = mongoose.model('Revolution', revSchema);

module.exports = Revolution;
