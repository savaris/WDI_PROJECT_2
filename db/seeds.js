const rp = require('request-promise');

// https://developers.webcams.travel/#webcams-api-webcam-timelapse-object
// https://webcamstravel.p.mashape.com/webcams/list/limit=50,0?show=webcams:location,image,url

// These code snippets use an open-source library. http://unirest.io/nodejs
// unirest.get("https://webcamstravel.p.mashape.com/webcams/list/nearby={lat},{lng},{radius}")
// .header("X-Mashape-Key", "5N1IqU0Ln5msh2kJB8FNMmu9Ahdrp1BpIWkjsntkQAspOznbn1")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });
