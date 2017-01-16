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
  // $('#map-canvas').hide();
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

$(App.init.bind(App));

// Map functions
const googleMap = googleMap || {};
const google = google;

// Modal Pop-Up
googleMap.addInfoWindowForWebcam = function(webcam, marker){
  // Inbuilt defined Google click event
  google.maps.event.addListener(marker, 'click',() => {
    $('.modal-body').html(`
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active">
          <a href="#camera" aria-controls="camera" role="tab" data-toggle="tab">Web Camera</a>
          <iframe src="${webcam.timelapse.month.embed}?autoplay=1" width="480px" height="340px"></iframe>
          <p>${webcam.title}</p>
          <p>${webcam.location.country}</p>
          <p>${webcam.location.city}</p>
          <p>${webcam.location.region}</p>
        </li>
        <li role="presentation">
          <a href="#forecast" aria-controls="forecast" role="tab" data-toggle="tab">Forecast</a>
        </li>
        <li role="presentation">
          <a href="#uploads" aria-controls="uploads" role="tab" data-toggle="tab">Recent Uploads</a>
        </li>
      </ul>

         <!-- Tab panes -->
         <div class="tab-content">
          <div role="tabpanel" class="tab-pane active" id="home">
        </div>
          <div role="tabpanel" class="tab-pane" id="Forecast">
        </div>
          <div role="tabpanel" class="tab-pane" id="Recent Uploads">
      </div>`);
    $('.modal').modal('show');
  });
};

// Info Window Pop-Up
// googleMap.addInfoWindowForWebcam = function(webcam, marker){
//   // Inbuilt defined Google click event
//   google.maps.event.addListener(marker, 'click',() => {
// if (typeof this.infoWindow !== 'undefined')this.infoWindow.close();
// this.infoWindow = new google.maps.InfoWindow({
//   content: `<div class ="info-marker">
//   <iframe src="${webcam.timelapse.month.embed}?autoplay=1" width="480px" height="340px"></iframe>
//   <p>${webcam.title}</p>
//   <p>${webcam.location.country}</p>
//   <p>${webcam.location.city}</p>
//   <p>${webcam.location.region}</p>
//   </div>`
// });
// this.infoWindow.open(this.map, marker);
// this.map.setCenter(marker.getPosition());
// this.map.setZoom(12);

googleMap.createMarkerForWebcam = function(webcam){
  const latlng = new google.maps.LatLng(webcam.location.latitude, webcam.location.longitude);
  const marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    icon: '/images/icon.jpg',
    animation: google.maps.Animation.DROP
  });
  this.addInfoWindowForWebcam(webcam, marker);
  marker.addListener('click', toggleBounce);
};

// Function not working
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

googleMap.loopThroughWebcams = function(data) {
  $.each(data.result.webcams, (index, webcam) => {
    setTimeout(() => {
      googleMap.createMarkerForWebcam(webcam);
    },index * 500);
  });
};

googleMap.getWebcams = function(){

  // App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/country=FR/category=beach/orderby=popularity/limit=1,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);


  // App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/orderby=popularity/limit=1,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);

  App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/continent=EU/property=hd/orderby=views/limit=1,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);


  // for (var i = 0; i < 5; i++) {
  //   App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/category=city/limit=50,${i}?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);
  // }
};

googleMap.mapSetup = function(){
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(46.934003, 8.129233),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getWebcams();
};


$(googleMap.mapSetup.bind(googleMap));
