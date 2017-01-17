const rp = require('request-promise');

function forecast(req, res) {
  console.log('HERE')

  return rp(`https://api.darksky.net/forecast/c8f3ad2e4a7cadd02accf88261c9291a/${req.params.lat},${req.params.lng}`)
  .then(htmlString => {
    const json = JSON.parse(htmlString);
    return res.status(200).json({
      summary: json.daily.summary
    });
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json(err);
  });
}

module.exports = {
  forecast
};
