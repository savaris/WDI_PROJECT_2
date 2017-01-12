const WebCam = require('../models/webCam');

function webCamsIndex(req, res){
  WebCam.find((err, webCams) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ webCams: webCams });
  });
}

module.exports = {
  index: webCamsIndex
};
