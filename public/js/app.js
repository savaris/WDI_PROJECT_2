"use strict";var App=App||{},google=google;App.init=function(){App.mapSetup(),this.apiUrl="http://localhost:3000/api",this.$main=$("main"),this.mapMarkers=[],$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),this.$main.on("submit","form",this.handleForm),this.getToken()?this.loggedInState():this.loggedOutState(),$("body").on("hidden.bs.modal",function(){App.map.setZoom(6)})},App.loggedInState=function(){$(".loggedIn").show(),$(".loggedOut").hide(),$("#map-canvas").show(),App.getWebcams()},App.loggedOutState=function(){$(".loggedIn").hide(),$(".loggedOut").show(),this.register(),this.clearMarker()},App.register=function(e){e&&e.preventDefault(),this.$main.html("<div class='modal fade' tabindex='-1' role='dialog'>\n  <div class='modal-dialog' role='document'>\n  <div class='modal-content'>\n  <div class='modal-body'>\n  <h2>Register</h2>\n    <form method='post' action='/register'>\n    <div class='form-group'>\n    <input class='form-control-register' type='text' name='user[username]' placeholder='Username'>\n    </div>\n    <div class='form-group'>\n    <input class='form-control-register' type='email' name='user[email]' placeholder='Email'>\n    </div>\n    <div class='form-group'>\n    <input class='form-control-register' type='password' name='user[password]' placeholder='Password'>\n    </div>\n    <div class='form-group'>\n    <input class='form-control-register' type='password' name='user[passwordConfirmation]' placeholder='Password Confirmation'>\n    </div>\n    <input class='btn btn-primary' type='submit' value='Register'>\n    </form>\n  </div>\n  </div>\n  </div>\n  </div>\n  "),$(".modal").modal("show")},App.login=function(e){e&&e.preventDefault(),this.$main.html("\n    <div class='modal fade' tabindex='-1' role='dialog'>\n    <div class='modal-dialog' role='document'>\n    <div class='modal-content'>\n    <div class='modal-body'>\n    <h2>Login</h2>\n    <form method='post' action='/login'>\n    <div class='form-group'>\n    <input class='form-control-login' type='email' name='email' placeholder='Email'>\n    </div>\n    <div class='form-group'>\n    <input class='form-control-login' type='password' name='password' placeholder='Password'>\n    </div>\n    <input class='btn btn-primary' type='submit' value='Login'>\n    </form>\n    </div>\n    </div>\n    </div>\n    </div>\n    "),$(".modal").modal("show")},App.logout=function(e){e.preventDefault(),this.removeToken(),this.loggedOutState()},App.handleForm=function(e){e.preventDefault();var t=""+App.apiUrl+$(this).attr("action"),o=$(this).attr("method"),a=$(this).serialize();return App.ajaxRequest(t,o,a,function(e){e.token&&($(".fade").fadeOut(),App.setToken(e.token),App.loggedInState())})},App.ajaxRequest=function(e,t,o,a,n){return $.ajax({url:e,method:t,data:o,beforeSend:n?n:this.setRequestHeader.bind(this)}).done(a).fail(function(e){console.log(e)})},App.setRequestHeader=function(e){return e.setRequestHeader("Authorization","Bearer "+this.getToken())},App.setApiToken=function(e){return e.setRequestHeader("X-Mashape-Key","5N1IqU0Ln5msh2kJB8FNMmu9Ahdrp1BpIWkjsntkQAspOznbn1")},App.setToken=function(e){return window.localStorage.setItem("token",e)},App.getToken=function(){return window.localStorage.getItem("token")},App.removeToken=function(){return window.localStorage.clear()},App.addInfoWindowForWebcam=function(e,t){var o=this;google.maps.event.addListener(t,"click",function(){o.ajaxRequest("http://localhost:3000/api/forecast/"+e.location.latitude+"/"+e.location.longitude,"get",null,function(a){o.$main.html("<div class='modal fade' tabindex='-1' role='dialog'>\n      <div class='modal-dialog' role='document'>\n      <div class='modal-content'>\n      <div class='modal-body'>\n      <ul class='nav nav-tabs' id='cam-info'>\n          <li class='nav-item active'>\n            <a href='#camera' aria-controls='camera' data-toggle='tab'><i class=\"fa fa-video-camera\" aria-hidden=\"true\"></i> Camera</a>\n          </li>\n          <li class='nav-item'>\n            <a href='#details' aria-controls='details' data-toggle='tab'><i class=\"fa fa-info\" aria-hidden=\"true\"></i> Details</a>\n          </li>\n          <li class='nav-item'>\n            <a href='#weather' aria-controls='weather' data-toggle='tab'><i class=\"fa fa-sun-o\" aria-hidden=\"true\"></i> Weather</a>\n          </li>\n      </ul>\n\n      <div class='tab-content'>\n        <div role='tabpanel' class='tab-pane active' id='camera'>\n        <iframe src='"+e.timelapse.month.embed+"?autoplay=1' width='480px' height='340px' allowfullscreen></iframe>\n      </div>\n      <div role='tabpanel' class='tab-pane' id='details'>\n        <p><strong>Title:</strong> "+e.title+"</p>\n        <p><strong>Country:</strong> "+e.location.country+"</p>\n        <p><strong>City:</strong> "+e.location.city+"</p>\n        <p><strong>Region:</strong> "+e.location.region+"</p>\n        <p><strong>Forecast:</strong> "+a.summary+"</p>\n      </div>\n        <div role='tabpanel' class='tab-pane' id='weather'>\n        <iframe width='96%%' frameBorder='0' style='height: 50vh; margin: 25px 0;' src='https://maps.darksky.net/@temperature,"+e.location.latitude+","+e.location.longitude+",10?embed=true&timeControl=true&fieldControl=true&defaultField=temperature&defaultUnits=_c'></iframe>\n      </div>\n    </div>\n    </div>\n    </div>\n    </div>\n    </div>\n        "),$(".modal").modal("show"),o.map.setCenter(t.getPosition()),o.map.setZoom(12)})},null)},App.toggleBounce=function(e){var t=this;google.maps.event.addListener(e,"click",function(){$.each(t.mapMarkers,function(e,t){t.setAnimation(null)}),e.setAnimation(google.maps.Animation.BOUNCE)})},App.createMarkerForWebcam=function(e){var t=new google.maps.LatLng(e.location.latitude,e.location.longitude),o=new google.maps.Marker({position:t,map:this.map,icon:"/images/icon.jpg",animation:google.maps.Animation.DROP});this.mapMarkers.push(o),this.toggleBounce(o),this.addInfoWindowForWebcam(e,o)},App.loopThroughWebcams=function(e){$.each(e.result.webcams,function(e,t){setTimeout(function(){App.createMarkerForWebcam(t)},200*e)})},App.getWebcams=function(){App.ajaxRequest("https://webcamstravel.p.mashape.com/webcams/list/continent=EU/property=hd/orderby=views/limit=25,?show=webcams:location,url,timelapse","GET",null,this.loopThroughWebcams,App.setApiToken)},App.getNearcams=function(e){App.ajaxRequest("https://webcamstravel.p.mashape.com/webcams/list/limit=25/nearby="+e.lat+","+e.lng+",50?show=webcams:location,url,timelapse","GET",null,this.loopThroughWebcams,App.setApiToken)},App.mapSetup=function(){var e=document.getElementById("map-canvas"),t={zoom:6,center:new google.maps.LatLng(46.631204,8.593613),mapTypeId:google.maps.MapTypeId.ROADMAP,styles:[{featureType:"water",elementType:"geometry",stylers:[{color:"#e9e9e9"},{lightness:17}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#f5f5f5"},{lightness:20}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:16}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:21}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:21}]},{elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#ffffff"},{lightness:16}]},{elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#990000"},{lightness:40}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#f2f2f2"},{lightness:19}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#dedede"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#dedede"},{lightness:17},{weight:1.2}]}],mapTypeControl:!0,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,position:google.maps.ControlPosition.BOTTOM_CENTER},fullscreenControl:!0,fullscreenControlOptions:{position:google.maps.ControlPosition.BOTTOM_LEFT}};App.map=new google.maps.Map(e,t),App.map.addListener("dblclick",function(e){var t=parseFloat(e.latLng.lat()),o=parseFloat(e.latLng.lng());App.updateCoords={lat:t,lng:o},App.getNearcams(App.updateCoords)})},App.clearMarker=function(){for(var e=0;e<this.mapMarkers.length;e++)this.mapMarkers[e].setMap(null)},$(App.init.bind(App));