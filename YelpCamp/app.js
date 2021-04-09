// This is the main file of our application.

// If we're in developing mode (not production) we will require the dotenv package:
if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    // This will take our environment variables from our .env file and add them to process.env in our app
}
// Print the variable SECRET from our .env file:
// console.log(process.env.SECRET); --> This was for testing.

// Here we add all the packages we need for this app:
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// Require ejs-mate to insert code from our boilerplate
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
// Require our class ExpressError:
const ExpressError = require("./utils/ExpressError");
// The next require allows us to use methods like "PUT" or "DELETE":
const methodOverride = require("method-override");
// Require passport, our authentication middleware:
const passport = require("passport");
// Require our strategy for passport, which will be Local:
const LocalStrategy = require("passport-local");
// Require our user model:
const User = require("./models/user");
// Require Helmet to help secure Express apps (it sets various HTTP headers):
const helmet = require("helmet");

// Require Mongo package to prevent injection attacks. It removes any keys containing prohibited characters:
const mongoSanitize = require("express-mongo-sanitize");

// REQUIRE EXPRESS ROUTERS:
// Here we will require our file with the campground routes:
const campgroundRoutes = require("./routes/campgrounds");
// And we will require our file with the review routes:
const reviewRoutes = require("./routes/reviews");
// And also we require the User router:
const userRoutes = require("./routes/users");

// Require Connect-mongo package to help Session connect with MongoDB:
const MongoStore = require("connect-mongo");
// Create a variable to store the  db url to connect with MongoDB Atlas (and give it a default for development):
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";


// MONGOOSE:
// Connect mongoose to mongodb:
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// Check if there is an error with the database:
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Use ejs-mate to help build a boilerplate in our app:
app.engine("ejs", ejsMate)
// Set the views directory for rendering ejs files. Accessible from different directories:
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use the following code to parse the body:
app.use(express.urlencoded({extended: true}));
// Use the following code to add PUT, PATCH and other methods instead of just GET and PUT:
app.use(methodOverride("_method"));
// The following code will help serve static assets from the public directory:
app.use(express.static(path.join(__dirname, "public")));
// Use mongoSanitize to prevent prohibited behaviour with queries:
app.use(mongoSanitize());

// Let's create a secrete with our env.SECRET or give it a default value for development:
const secret = process.env.SECRET || "thisshouldbeabettersecret!";

// Create the store using the MongoStore.create() method:
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // time of the session in seconds
    crypto: {
        secret
    }
})
// Check for any errors:
store.on("error", function(e){
    console.log("Session Store Error", e);
})

// EXPRESS-SESSION:
// The next code will create a session cookie to eventually show flash messages, using express-session:
const sessionConfig = {
    // Pass the recently created store:
    store, // With this, Session uses mongo to store information.
    // It is a good practice to give it a name (otherwise it will auto generate a default one that can be tracked):
    name: "session",
    // Set the session secret:
    secret,
    // Make deprecation warnings disappear:
    resave: false,
    saveUninitialized: true,
    // Set up the cookie:
    cookie: {
        // Set httpOnly to true so cookie can not be accessed through client side script:
        httpOnly: true,
        // Set the cookie so it only work on https (secure):
        // secure: true,
        // Expire after a week (it's in miliseconds):
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// Use the session called "sessionConfig":
app.use(session(sessionConfig));

// Use flash package to show messages on a session:
app.use(flash());

// HELMET
// Use helmet package to help secure our app:
app.use(helmet());
// we have to configure our contentSecurityPolicy so it allows external links and self sources loading:

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net", // This is for the most recente Bootstrap version (5 beta 3)
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dm3rusxcr/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// PASSPORT:
// The following middlewares are needed to initialize Passport:
app.use(passport.initialize());
app.use(passport.session()); // Note: This line must come after "app.use(session(sessionConfig));"
// Now we tell passport to use LocalStrategy and the method authenticate on the User model:
passport.use(new LocalStrategy(User.authenticate()));
// Next we tell passport how to serialize a user (store a user in a session):
passport.serializeUser(User.serializeUser());
// And deserialize (get a user out of that session):
passport.deserializeUser(User.deserializeUser());


// MIDDLEWARE THAT RUNS FOR EVERY REQUEST:
// Let's define a middleware that will run for every single request. It will also show flash messages:
app.use((req, res, next) => {
    // If a user was NOT coming from the homepage("/") or the login page ("/login"),
    // We can redirect him to the url he was trying to access when asked to log in:
    if(!["/login","/register", "/"].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }    
    // We wil also use passport's req.user to assign it to the current user in session:
    res.locals.currentUser = req.user; // curretnUser is now accessible in all templates
    // Now for the flash messages:
    // Check if there's anything stored in flash under the key = "success"
    res.locals.success = req.flash("success");
    // Check if there's anything stored in flash under the key = "error"
    res.locals.error = req.flash("error");
    next();
})


// EXPRESS ROUTER:
// Here we specify the router we want to use with a path.
// Let's define the route and path for the users:
app.use("/", userRoutes);
// For the campground routes we will start them with "/campgrounds":
app.use("/campgrounds", campgroundRoutes);
// And for the reviews routes we will start them with "/campgrounds/:id/reviews":
app.use("/campgrounds/:id/reviews", reviewRoutes);

// Add a root route:
app.get("/", (req, res) => {
    res.render("home")
})

// // Let's create a test campground to see if the database is working properly:
// app.get("/makecampground", async (req, res) => {
//     const camp = new Campground({title: "My Backyard", description: "Cheap Camping!"});
//     await camp.save();
//     res.send(camp);
// })


// Let's add a 404 error if some URL we don't recognize is requested.
// Note that this will only run if nothing else (route) is matched.
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

// Let's set up our try and catch in async function.
app.use((err, req, res, next) => {
    // Let's destructure the error (that comes from a next()) and give it a default value:
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong"
    // And then pass err render our error template:
    res.status(statusCode).render("error", {err})
})

// We create a route to connect to our local server on port 3000 (for development).
// When we deploy our app, we should use Heroku's port so we define a variable for it:
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})