const Webcam = require('../models/webcam');

function webcamsIndex(req, res){
  Webcam.find((err, webcams) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ webcams: webcams });
  });
}

module.exports = {
  index: webcamsIndex
};
