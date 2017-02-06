const mongoose = require('mongoose');

const webcamSchema = mongoose.Schema({
  name: String,
  img: String,
  lat: String,
  lng: String
});

module.exports = mongoose.model('Webcam', webcamSchema);
