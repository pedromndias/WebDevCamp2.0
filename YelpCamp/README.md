This is the final project of the course.
In this app we have a homepage where we have brief info about the website. It's a place where we can create campgrounds and view all the different
campgrounds uploaded by other users. There are links to Login, Register and view all the Campgrounds. Once registered and logged in, a user can 
create a new campground, specifying a name, location, price, description and upload image (if none there will be a default one). That location
will be added to the map displayed at the app, where we can see the cities of all campgrounds, using a cluster/pin system on a real world map.
By clicking on a campground we can see all of its info, including a pin on a map. Reviews on that campground are allowed by any user that is logged in.
Editing and deleting is also possible but only by the creator of the campground.  By logging out we loose some permissions like creating a new
campground or reviewing a place.
During the weeks of building the app, a lot of technologies, platforms and packages were used (all the HTML, CSS and JS learned in the bootcamp).
We acquired these knowledges mainly for:
error handling and validation (ExpressError and JOI), databases and models (MongoDB), sessions and cookies (Express Session), messages (Flash),
authentication and authorization (Passport), files/image upload (Multer and Cloudinary), geocoding and maps (GeoJSON and Mapbox), security issues 
(Sanitize packages and Helmet) and deploying (MongoDB Atlas and Heroku).
I uploaded my code on Heroku which created a link to access the website on the internet:
https://salty-dusk-73067.herokuapp.com/
