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
List of dependencies in this app:
    "@mapbox/mapbox-sdk": "^0.12.1",
    "cloudinary": "^1.25.1",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^4.4.1",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.6",
    "ejs-mate": "^3.0.0",
    "express": "^4.17.1",
    "express-mongo-sanitize": "^2.0.2",
    "express-session": "^1.17.1",
    "helmet": "^4.4.1",
    "joi": "^17.4.0",
    "method-override": "^3.0.0",
    "mongoose": "^5.12.0",
    "multer": "^1.4.2",
    "multer-storage-cloudinary": "^4.0.0",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^6.1.0",
    "sanitize-html": "^2.3.3"
