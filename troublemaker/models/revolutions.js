const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const revSchema = new Schema({
  name: String,
  date: Date,
  molotovScale: Number,
  description: String,
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
  location: {latitude: Number, longitude: Number},
  callToAction: String,
  creator: {type: Schema.Types.ObjectId, ref: 'User'}

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Revolution = mongoose.model('Revolution', revSchema);

module.exports = Revolution;
