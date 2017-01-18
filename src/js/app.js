const App = App || {};
const google = google;

App.init = function() {
  App.mapSetup();
  this.apiUrl = 'http://localhost:3000/api';
  this.$main  = $('main');
  this.mapMarkers = [];

  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  this.$main.on('submit', 'form', this.handleForm);
  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
  $('body').on('hidden.bs.modal', function(){
    App.map.setZoom(7);
  });
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
  $('#map-canvas').show();
  App.getWebcams();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
  this.register();
  this.clearMarker();
};

App.register = function(e){
  if (e) e.preventDefault();
  this.$main.html(`<div class='modal fade' tabindex='-1' role='dialog'>
  <div class='modal-dialog' role='document'>
  <div class='modal-content'>
  <div class='modal-body'>
  <h2>Register</h2>
    <form method='post' action='/register'>
    <div class='form-group'>
    <input class='form-control-register' type='text' name='user[username]' placeholder='Username'>
    </div>
    <div class='form-group'>
    <input class='form-control-register' type='email' name='user[email]' placeholder='Email'>
    </div>
    <div class='form-group'>
    <input class='form-control-register' type='password' name='user[password]' placeholder='Password'>
    </div>
    <div class='form-group'>
    <input class='form-control-register' type='password' name='user[passwordConfirmation]' placeholder='Password Confirmation'>
    </div>
    <input class='btn btn-primary' type='submit' value='Register'>
    </form>
  </div>
  </div>
  </div>
  </div>
  `);
  $('.modal').modal('show');
};

App.login = function(e) {
  if(e) e.preventDefault();
  this.$main.html(`
    <div class='modal fade' tabindex='-1' role='dialog'>
    <div class='modal-dialog' role='document'>
    <div class='modal-content'>
    <div class='modal-body'>
    <h2>Login</h2>
    <form method='post' action='/login'>
    <div class='form-group'>
    <input class='form-control-login' type='email' name='email' placeholder='Email'>
    </div>
    <div class='form-group'>
    <input class='form-control-login' type='password' name='password' placeholder='Password'>
    </div>
    <input class='btn btn-primary' type='submit' value='Login'>
    </form>
    </div>
    </div>
    </div>
    </div>
    `);
  $('.modal').modal('show');
};

App.logout = function(e){
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

App.handleForm = function(e){
  e.preventDefault();

  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, data => {
    if (data.token) {
      $('.fade').fadeOut();
      App.setToken(data.token);
      App.loggedInState();
    }
  });
};

App.ajaxRequest = function(url, method, data, callback, apiToken){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: apiToken ? apiToken : this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

App.setRequestHeader = function(xhr) {
  return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
};

App.setApiToken = function(xhr) {
  return xhr.setRequestHeader('X-Mashape-Key', `5N1IqU0Ln5msh2kJB8FNMmu9Ahdrp1BpIWkjsntkQAspOznbn1`);
};

App.setToken = function(token){
  return window.localStorage.setItem('token', token);
};

App.getToken = function(){
  return window.localStorage.getItem('token');
};

App.removeToken = function(){
  return window.localStorage.clear();
};

App.addInfoWindowForWebcam = function(webcam, marker){
  google.maps.event.addListener(marker, 'click',() => {
    this.ajaxRequest(`http://localhost:3000/api/forecast/${webcam.location.latitude}/${webcam.location.longitude}`, 'get', null, data => {
      this.$main.html(`<div class='modal fade' tabindex='-1' role='dialog'>
      <div class='modal-dialog' role='document'>
      <div class='modal-content'>
      <div class='modal-body'>
      <ul class='nav nav-tabs' id='cam-info'>
          <li class='nav-item active'>
            <a href='#camera' aria-controls='camera' data-toggle='tab'><i class="fa fa-video-camera" aria-hidden="true"></i> Camera</a>
          </li>
          <li class='nav-item'>
            <a href='#details' aria-controls='details' data-toggle='tab'><i class="fa fa-info" aria-hidden="true"></i> Details</a>
          </li>
          <li class='nav-item'>
            <a href='#weather' aria-controls='weather' data-toggle='tab'><i class="fa fa-sun-o" aria-hidden="true"></i> Weather</a>
          </li>
      </ul>

      <div class='tab-content'>
        <div role='tabpanel' class='tab-pane active' id='camera'>
        <iframe src='${webcam.timelapse.month.embed}?autoplay=1' width='480px' height='340px' allowfullscreen></iframe>
      </div>
      <div role='tabpanel' class='tab-pane' id='details'>
        <p><strong>Title:</strong> ${webcam.title}</p>
        <p><strong>Country:</strong> ${webcam.location.country}</p>
        <p><strong>City:</strong> ${webcam.location.city}</p>
        <p><strong>Region:</strong> ${webcam.location.region}</p>
        <p><strong>Forecast:</strong> ${data.summary}</p>
      </div>
        <div role='tabpanel' class='tab-pane' id='weather'>
        <iframe width='96%%' frameBorder='0' style='height: 50vh; margin: 25px 0;' src='https://maps.darksky.net/@temperature,${webcam.location.latitude},${webcam.location.longitude},10?embed=true&timeControl=true&fieldControl=true&defaultField=temperature&defaultUnits=_c'></iframe>
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
        `);
      $('.modal').modal('show');
      this.map.setCenter(marker.getPosition());
      this.map.setZoom(12);
    });
  }, null);
};

App.toggleBounce = function(marker) {
  google.maps.event.addListener(marker, 'click',() => {

    $.each(this.mapMarkers, (index, marker) => {
      marker.setAnimation(null);
    });

    marker.setAnimation(google.maps.Animation.BOUNCE);
  });
};

App.createMarkerForWebcam = function(webcam){
  const latlng = new google.maps.LatLng(webcam.location.latitude, webcam.location.longitude);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    icon: '/images/icon.jpg',
    animation: google.maps.Animation.DROP
  });

  this.mapMarkers.push(marker);
  this.toggleBounce(marker);
  this.addInfoWindowForWebcam(webcam, marker);
};

App.loopThroughWebcams = function(data) {
  $.each(data.result.webcams, (index, webcam) => {
    setTimeout(() => {
      App.createMarkerForWebcam(webcam);
    },index * 400);
  });
};

App.getWebcams = function(){
  App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/continent=EU/property=hd/orderby=views/limit=4,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);
};

App.getNearcams = function(object){
  App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/limit=4/nearby=${object.lat},${object.lng},250?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);
};

App.mapSetup = function(){
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(46.631204, 8.593613),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{'featureType': 'water','elementType': 'geometry','stylers': [{'color': '#e9e9e9'},{'lightness': 17}]},{'featureType': 'landscape','elementType': 'geometry','stylers': [{'color': '#f5f5f5'},{'lightness': 20}]},{'featureType': 'road.highway','elementType': 'geometry.fill','stylers': [{'color': '#000000'},{'lightness': 17}]},{'featureType': 'road.highway','elementType': 'geometry.stroke','stylers': [{'color': '#000000'},{'lightness': 29},{'weight': 0.2}]},{'featureType': 'road.arterial','elementType': 'geometry','stylers': [{'color': '#dedede'},{'lightness': 18}]},{'featureType': 'road.local','elementType': 'geometry','stylers': [{'color': '#dedede'},{'lightness': 16}]},{'featureType': 'poi','elementType': 'geometry','stylers': [{'color': '#dedede'},{'lightness': 21}]},{'featureType': 'poi.park','elementType': 'geometry','stylers': [{'color': '#dedede'},{'lightness': 21}]},{'elementType': 'labels.text.stroke','stylers': [{'visibility': 'on'},{'color': '#ffffff'},{'lightness': 16}]},{'elementType': 'labels.text.fill','stylers': [{'saturation': 36},{'color': '#990000'},{'lightness': 40}]},{'elementType': 'labels.icon','stylers': [{'visibility': 'off'}]},{'featureType': 'transit','elementType': 'geometry','stylers': [{'color': '#f2f2f2'},{'lightness': 19}]},{'featureType': 'administrative','elementType': 'geometry.fill','stylers': [{'color': '#dedede'},{'lightness': 20}]},{'featureType': 'administrative','elementType': 'geometry.stroke','stylers': [{'color': '#dedede'},{'lightness': 17},{'weight': 1.2}]}],
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT
    }
  };

  App.map = new google.maps.Map(canvas, mapOptions);
  App.map.addListener('dblclick', function(e) {
    const lat = parseFloat(e.latLng.lat());
    const lng = parseFloat(e.latLng.lng());
    App.updateCoords = {lat: lat, lng: lng};
    App.getNearcams(App.updateCoords);
  });
};

App.clearMarker = function(){
  for (var i = 0; i < this.mapMarkers.length; i++) {
    this.mapMarkers[i].setMap(null);
  }
};

$(App.init.bind(App));
