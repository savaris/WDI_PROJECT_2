const App = App || {};
const google = google;

App.init = function() {
  // $('#map-canvas').hide();
  App.mapSetup();
  this.apiUrl = 'http://localhost:3000/api';
  this.$main  = $('main');
  this.mapMarkers = [];

  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  // $('.usersIndex').on('click', this.usersIndex.bind(this));
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
  App.getWebcams();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('.loggedOut').show();
  // $('#map-canvas').hide();
  this.register();
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

// App.register = function(e){
//   if (e) e.preventDefault();
//   this.$main.html(`
//     <h2>Register</h2>
//     <form method='post' action='/register'>
//     <div class='form-group'>
//     <input class='form-control' type='text' name='user[username]' placeholder='Username'>
//     </div>
//     <div class='form-group'>
//     <input class='form-control' type='email' name='user[email]' placeholder='Email'>
//     </div>
//     <div class='form-group'>
//     <input class='form-control' type='password' name='user[password]' placeholder='Password'>
//     </div>
//     <div class='form-group'>
//     <input class='form-control' type='password' name='user[passwordConfirmation]' placeholder='Password Confirmation'>
//     </div>
//     <input class='btn btn-primary' type='submit' value='Register'>
//     </form>
//   `);
// };

// App.login = function(e){
//   if (e) e.preventDefault();
//   this.$main.html(`<div class='modal fade' id='exampleModal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
//   <div class='modal-dialog' role='document'>
//     <div class='modal-content'>
//     <div class='modal-header'>
//       <h5 class='modal-title' id='exampleModalLabel'>Login</h5>
//       <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
//   </div>
//   <div class='modal-body'>
//     <form action='/login' method='POST'>
//     <div class='form-group'>
//     <label for='recipient-name' class='form-control-label'>Email:</label>
//     <input type='text' name='user[email]' class='form-control' id='email'>
//   </div>
//   <div class='form-group'>
//     <label for='recipient-name' class='form-control-label'>Password:</label>
//     <input type='password' name='user[password]' class='form-control' id='password'>
//   </div>
//     <div class='modal-footer'>
//     <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>
//   <button type='submit' class='btn btn-primary registerUser value='login'>Log In</button>
//   </div>
//   </form>
//   </div>
//   </div>
//   </div>
//   </div>
//   `);
//   $('.modal').modal('show');
// };

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
  return xhr.setRequestHeader('Authorization', `Bearer       ${this.getToken()}`);
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

  // ------------------
  //   MAP FUNCTIONS
  // ------------------


// Modal Pop-Up
App.addInfoWindowForWebcam = function(webcam, marker){
// Inbuilt defined Google click event
  google.maps.event.addListener(marker, 'click',() => {
    $('.modal').show();
    $('.modal-body').html(`
      <ul class='nav nav-tabs'>
          <li class='nav-item active'>
            <a href='#camera' aria-controls='camera' data-toggle='tab'>Camera</a>
          </li>
          <li class='nav-item'>
            <a href='#details' aria-controls='details' data-toggle='tab'>Details</a>
          </li>
          <li class='nav-item'>
            <a href='#weather' aria-controls='weather' data-toggle='tab'>Weather</a>
          </li>
      </ul>

      <div class='tab-content'>
        <div role='tabpanel' class='tab-pane active' id='camera'>
        <iframe src='${webcam.timelapse.month.embed}?autoplay=1' width='480px' height='340px' allowfullscreen></iframe>
      </div>
      <div role='tabpanel' class='tab-pane' id='details'>
        <p>Title: ${webcam.title}</p>
        <p>Country: ${webcam.location.country}</p>
        <p>City: ${webcam.location.city}</p>
        <p>Region: ${webcam.location.region}</p>
      </div>
        <div role='tabpanel' class='tab-pane' id='weather'>
        <iframe width='96%%' frameBorder='0' style='height: 50vh; margin: 25px 0;' src='https://maps.darksky.net/@temperature,${webcam.location.latitude},${webcam.location.longitude},10?embed=true&timeControl=true&fieldControl=true&defaultField=temperature&defaultUnits=_c'></iframe>
      </div>
    </div>
        `);
    $('.modal').modal('show');
  });
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

  // App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/country=FR/category=beach/orderby=popularity/limit=1,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);

  App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/continent=EU/property=hd/orderby=views/limit=2,?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);


  // for (var i = 0; i < 5; i++) {
  //   App.ajaxRequest(`https://webcamstravel.p.mashape.com/webcams/list/category=city/limit=50,${i}?show=webcams:location,url,timelapse`, 'GET', null, this.loopThroughWebcams, App.setApiToken);
  // }
};

App.mapSetup = function(){
  console.log('building map');
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(46.934003, 8.129233),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        'featureType': 'all',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'weight': '2.00'
          }
        ]
      },
      {
        'featureType': 'all',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#9c9c9c'
          }
        ]
      },
      {
        'featureType': 'all',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'landscape',
        'elementType': 'all',
        'stylers': [
          {
            'color': '#f2f2f2'
          }
        ]
      },
      {
        'featureType': 'landscape',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#ffffff'
          }
        ]
      },
      {
        'featureType': 'landscape.man_made',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#ffffff'
          }
        ]
      },
      {
        'featureType': 'poi',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'all',
        'stylers': [
          {
            'saturation': -100
          },
          {
            'lightness': 45
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#eeeeee'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#7b7b7b'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels.text.stroke',
        'stylers': [
          {
            'color': '#ffffff'
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels.icon',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'transit',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'all',
        'stylers': [
          {
            'color': '#46bcec'
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#c8d7d4'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#070707'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'labels.text.stroke',
        'stylers': [
          {
            'color': '#ffffff'
          }
        ]
      }
    ]
  };
  App.map = new google.maps.Map(canvas, mapOptions);
};

$(App.init.bind(App));

    // $(App.mapSetup.bind(App));
