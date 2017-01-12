// const rp = require('request-promise');

// https://developers.webcams.travel/#webcams-api-webcam-timelapse-object
// https://webcamstravel.p.mashape.com/webcams/list/limit=50,0?show=webcams:location,image,url

// These code snippets use an open-source library. http://unirest.io/nodejs
// unirest.get("https://webcamstravel.p.mashape.com/webcams/list/nearby={lat},{lng},{radius}")
// .header("X-Mashape-Key", "5N1IqU0Ln5msh2kJB8FNMmu9Ahdrp1BpIWkjsntkQAspOznbn1")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

const mongoose = require('mongoose');

const databaseURL = process.env.MONGOLAB_URL || 'mongodb://localhost:27017/wdi_project_2_web_cams';
mongoose.connect(databaseURL);

const Webcam = require('../models/webcam');

Webcam.collection.drop();

const webcam1 = new Webcam({
  name: 'Web Cam',
  img: 'https://d1e4fni9ntsf6g.cloudfront.net/pages/buying-guides/logitech-webcam.jpg',
  lat: 51.492574,
  lng: -0.094584
});

webcam1.save((err, webcam) => {
  if (err) return console.log(err);
  return console.log(`${webcam.name} was saved`);
});

const webcam2 = new Webcam({
  name: 'Web Cam Two',
  img: 'https://d1e4fni9ntsf6g.cloudfront.net/pages/buying-guides/logitech-webcam.jpg',
  lat: 51.542863,
  lng: -0.136260
});

webcam2.save((err, webcam) => {
  if (err) return console.log(err);
  return console.log(`${webcam.name} was saved`);
});
