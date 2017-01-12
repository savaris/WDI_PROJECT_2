const mongoose = require('mongoose');

const webCamSchema = mongoose.Schema({
  img: String,
  lat: String,
  lng: String,
  location: String
});

module.exports = mongoose.model('WebCam', webCamSchema);
