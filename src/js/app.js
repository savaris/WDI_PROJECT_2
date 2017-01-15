const App = App || {};

App.init = function() {
  $('#map-canvas').hide();
  this.apiUrl = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.usersIndex').on('click', this.usersIndex.bind(this));
  this.$main.on('submit', 'form', this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
  // this.usersIndex();
  $('#map-canvas').show();
  googleMap.mapSetup();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
  this.register();
};

App.register = function(e){
  if (e) e.preventDefault();
  this.$main.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
      <div class="form-group">
        <input class="form-control" type="text" name="user[username]" placeholder="Username">
      </div>
      <div class="form-group">
        <input class="form-control" type="email" name="user[email]" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[password]" placeholder="Password">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
      </div>
      <input class="btn btn-primary" type="submit" value="Register">
    </form>
  `);
};

App.login = function(e) {
  e.preventDefault();
  this.$main.html(`
    <h2>Login</h2>
    <form method="post" action="/login">
      <div class="form-group">
        <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
    </form>
  `);
};

App.logout = function(e){
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

App.usersIndex = function(e) {
  if (e) e.preventDefault();
  const url = `${this.apiUrl}/users`;

  return this.ajaxRequest(url, 'get', null, data => {
    this.$main.html(`
      <div class="card-deck-wrapper">
        <div class="card-deck">
        </div>
      </div>
    `);
    const $container = this.$main.find('.card-deck');
    $.each(data.users, (i, user) => {
      $container.append(`
        <div class="card col-md-4">
         <div class="card-block">
           <h4 class="card-title">${user.username}</h4>
          </div>
       </div>`);
    });
  });
};

App.handleForm = function(e){
  e.preventDefault();

  const url    = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, data => {
    if (data.token) App.setToken(data.token);
    App.loggedInState();
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

// Map functions
$(App.init.bind(App));

const googleMap = googleMap || {};
const google = google;

googleMap.addInfoWindowForWebcam = function(webcam, marker){
  // Inbuilt defined Google click event
  google.maps.event.addListener(marker, 'click',() => {
    if (typeof this.infoWindow !== 'undefined')this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<div class ="info-marker">
      <iframe src="${webcam.timelapse.month.embed}?autoplay=1" width="320px" height="240px"></iframe>
      </div>`
    });
    this.infoWindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
    this.map.setZoom(10);

  });
};

googleMap.createMarkerForWebcam = function(webcam){
  const latlng = new google.maps.LatLng(webcam.location.latitude, webcam.location.longitude);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    animation: google.maps.Animation.DROP
  });
  this.addInfoWindowForWebcam(webcam, marker);

};

googleMap.loopThroughWebcams = function(data) {
  $.each(data.result.webcams, (index, webcam) => {
    setTimeout(() => {
      googleMap.createMarkerForWebcam(webcam);
    },index * 500);
  });
};

googleMap.getWebcams = function(){

  App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/country=FR/category=beach/orderby=popularity/limit=20,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);

  // App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/category=city/limit=50,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);
 // }

  // for (var i = 0; i < 5; i++) {
  //   App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/category=city/limit=50,${i}?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);
  // }



  // App.ajaxRequest('http://localhost:3000/api/webcams', 'GET', null, this.loopThroughWebcams);
};

googleMap.mapSetup = function(){
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 6,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getWebcams();
};

$(googleMap.mapSetup.bind(googleMap));
