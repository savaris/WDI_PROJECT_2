# WDI PROJECT 2
Second Project at General Assembly WDI London involved using an array of new technologies to create an app that utilised the Google Maps API to plot points based on latitude/longitude whilst also providing information about that location. The app utilised MongoDB, ExpressJS and Node.js.

---

# The Application
My application was based on using an external API from Mashape called which boasted a multitude of web cams around the world. More information regardin the site can be found at: 
http://www.webcams.travel/

Information in detail regarding the API can be found here:   
https://market.mashape.com/webcams-travel/webcams-travel

Upon finding the basis for my idea I drew up wireframes as an inducator to what I wanted my application to look like as an MVP through Balsamiq. Below are the wireframes I designed which I wanted to reflect my app in its entirety: 

---

<img width="1263" alt="screen shot 2017-03-12 at 20 21 27" src="https://cloud.githubusercontent.com/assets/23128874/23835690/c67ca8d4-0763-11e7-9152-4a83c244813e.png">

<img width="1255" alt="screen shot 2017-03-12 at 20 21 43" src="https://cloud.githubusercontent.com/assets/23128874/23835697/e2fe2ae6-0763-11e7-9253-5f05f104aba9.png">

<img width="1249" alt="screen shot 2017-03-12 at 20 21 57" src="https://cloud.githubusercontent.com/assets/23128874/23835705/fb4fa642-0763-11e7-8598-7131166f53c5.png">

---

After finalising the basic concept of the wireframes I started to create the file structure for my app using NPM(Node Package Modules) to install the dependencies/dev dependencies required for a functioning system.

---

<img width="1099" alt="screen shot 2017-03-12 at 20 46 42" src="https://cloud.githubusercontent.com/assets/23128874/23835774/10a274d8-0765-11e7-9461-030ba03a688d.png">


---

Some of the dev dependencies such as bcrypt and jsonwebtoken were used alongside user authentication for the app to be accessible only to registered users.

Before starting to type logic for the layout and requests to and from the API, I had to make sure to test the information I was getting back from the Webcam Travel API. I had to make sure that the end point was valid and was providing suitable object with usable data. I had to make sure that inputted the header type as well as the value in order for the API database to be accessible. Below is an example of a request I made using Insomnia:

---

<img width="1023" alt="screen shot 2017-03-12 at 22 22 31" src="https://cloud.githubusercontent.com/assets/23128874/23836599/cc35b6ee-0772-11e7-835e-0c67d89b3ade.png">


---

Once the testing was done, I created the user and webcam models whereby the user model required validation parsing in jwt so that a user would harber a token when they're logged in and removed once logged out. For both the models I created a Schema for what I wanted my database to hold. The user Schema had added functionality as it required validation and used virtual fields so that they wouldn't persist to the database.

Thereafter I started to work on my authenticated system RESTful and CRUD operations. Though my app doesn't allow thing such as update, delete it was good practice to get to use to some of the syntax and verb methods when posting/creating new users.
Both the user/webcam information would be subject to being retained in my Mongoose database as to retain user individuality.

Below is the code for the routes I used for my app:

---

<img width="1093" alt="screen shot 2017-03-12 at 22 32 43" src="https://cloud.githubusercontent.com/assets/23128874/23836673/e4bc2512-0773-11e7-8c77-09c715ff0301.png">

---

Upon completion of my models, config and controller arrangment I utilisied the Google Maps API using object oriented pogramming to append it to the DOM. The map setup used snazzy maps to update the way it looked to add a sense of uniquness making it stand out from other map based apps. More information regarding snazzy maps can be found here:  https://snazzymaps.com/

A simplifed version of how the app is setup is shown below using logged in/out states with the dismissal of modal using jQuery and then setting a set Zoom as a user signs in or registers. The logged in state used DOM manipulation to hide specific aspects of what is to be displayed on the page. In this case the Register button would dissapear and the map would become interactable with accessing to the Webcam Travel API through sending and recieving data.

---

<img width="1093" alt="screen shot 2017-03-12 at 23 21 17" src="https://cloud.githubusercontent.com/assets/23128874/23837092/abec521e-077a-11e7-80fc-b530ea76395e.png">

---

For both the Register and Login function I enabled Modal but had to implement e.preventDefault in order to prevent the page from refreshing/reloading. Both functions utilised the serialize method to enable data submittion to the database via forms through ajax requests.

---

<img width="1091" alt="screen shot 2017-03-12 at 23 28 05" src="https://cloud.githubusercontent.com/assets/23128874/23837147/9b500e18-077b-11e7-884e-077f3bbdfcdb.png">

---

The same ajax response was implemented when calling to the Webcam Travel Database utilising the request header for user permission and using callbacks to recieve data back.

---

<img width="1092" alt="screen shot 2017-03-12 at 23 38 37" src="https://cloud.githubusercontent.com/assets/23128874/23837245/1e4a64fc-077d-11e7-96b3-4d41a774c29b.png">

---

Making sure that all these implemented changes worked, I used the Google Maps API documentation to create markers for each targetted location. However when a users logs in the default request is set to get the 25 most popular hd webcame within Europe. Not only this but I also created a function that would drop 25 markers within a 50 mile radius of where a user clicks with a delayed timer between each timer of 2 seconds.

---

<img width="1095" alt="screen shot 2017-03-12 at 23 48 59" src="https://cloud.githubusercontent.com/assets/23128874/23837347/8a911a60-077e-11e7-837c-3eea45ca4950.png">

---

As those were functioning accordingly, I then set out to create a modal window for each individual marker using their latitude/longitude to request additional information within the Webcam object. I also used another API using a proxy within my controller to get a weather forecast for the day within that general location. The API used was Darksky and more information regarding their weather forecasts can be found here: https://darksky.net/dev/
With this API a proxy had to be used in order to get the summary for the relevant location which wasn't obtainable just via using Insomnia through the requested object.

---

<img width="1094" alt="screen shot 2017-03-12 at 23 58 26" src="https://cloud.githubusercontent.com/assets/23128874/23837424/fb1e1386-077f-11e7-8f5a-ab066c320e28.png">

---

As such when all the request provided the required information was to be displayed on a tabbed modal window showing the time lapse, details of the webcam area and an embedded Darksky map. Within the detailed tab I requested more information within the Webcame object such as the title, region, etc ...
I also incorporated a system wherbey all the current markers that were shown as a logged in user would disappear once logged out and zoom out to a predefined value. The same was implemented for when a marker is clicked and the map is zoon in prompting the modal window to present itself.

---

<img width="1091" alt="screen shot 2017-03-13 at 00 08 12" src="https://cloud.githubusercontent.com/assets/23128874/23837501/78353358-0781-11e7-9c7b-4cf839055e4a.png">

---

With all these functions incorporated I styled my app using Page.js so that a loading screen would appear showing the user how long before a request could be made. By utilising all these technologies I was able to create the app shown below: 

---

<img width="1280" alt="screen shot 2017-03-13 at 00 16 46" src="https://cloud.githubusercontent.com/assets/23128874/23837670/a395eafe-0783-11e7-9e4c-cd9e4145e0dc.png">


<img width="1280" alt="screen shot 2017-03-13 at 00 24 09" src="https://cloud.githubusercontent.com/assets/23128874/23837680/c2ad2f74-0783-11e7-8810-e0b9b223e4b3.png">

<img width="1280" alt="screen shot 2017-03-13 at 00 24 40" src="https://cloud.githubusercontent.com/assets/23128874/23837690/f4c0c5ca-0783-11e7-9df3-acbcaf18f0fd.png">

---I

A fully working version of the app can be found here:  https://web-cam-travel.herokuapp.com/

# Further implementations for the future.
As with any piece of code further functionality/styling is always part of its core. As such, additional features I would like to include further down the line are:  

* Implement another API to give recommendation of the local sites within a set radius around that region.
* Store markers you've already clicked on creating a view pages for the ones you've visited the most.
* Based on the markers clicked, create a suggested link to location with a similar geographical reference.
* Creation of a user profile index page so they can pick region/countries with regards to object parameters such as popularity, newest uploads, etc ...
* Allow users to post comment on time lapses, with an incorporated rating system of up to 5 stars.





