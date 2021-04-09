// This file will follow the Express router methodology for the campgrounds:
const express = require("express");
// Here, instead of "app." we use "router.":
const router = express.Router();
// We need to require our controller functions (methods inside an object that we will call "campgrounds")
const campgrounds = require("../controllers/campgrounds");
// Require the catchAsync function (note ".." because we need to go back one level of files):
const catchAsync = require("../utils/catchAsync");
// Require our middleware functions
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware")
// Let's require Multer so we can handle file uploading:
const multer = require("multer");
// Require the storage variable from our cloudinary file:
const {storage} = require("../cloudinary");
// Then we need to initialize the multer function with this storage object as the destination for our files:
const upload = multer({ storage });

/* Note that the main logic for these routes are in the campgrounds file
on the controllers directory. Here we wrap those async functions inside catchAsync */

/* Note how in most routes we use a middleware function (validateCampground) to 
validate our data and isLoggedIn to verify that the user is logged in before creating a
campground, accessing the edit page, editing or deleting a campground. We also use isAuthor
to check if the author of a campground is the current logged in user.*/

/* In some routes we use Multer so we can handle file uploading, using upload.array("image").
It has to be coded before "validateCampground" because Multer parses the data, then it will be validated*/

/* With express.Router we can chain routes with the same name (and different 
verbs). Note how we don't have to specify the path anymore, like get("/", ....) */
// Routes for ("/"):
router.route("/")
    // Create a campgrounds index:
    .get(catchAsync(campgrounds.index))
    // And now we create the post request for the new campground.
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

// Let's create a get route to render a form for a new Campground.
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// Routes for ("/:id"):
router.route("/:id")
    /* Let's craete a show route. Note: this route must be coded after the /new, 
    otherwise it will assume /new as /id */
    .get(catchAsync(campgrounds.showCampground))
    // Now we set up a PUT route to update a specfic campground:
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    // For the final CRUD we can create a delete route:
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// To edit a campground we need a get route with a form (prepopulated with the information)
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// Finally, we export our router to use it on app.js
module.exports = router;