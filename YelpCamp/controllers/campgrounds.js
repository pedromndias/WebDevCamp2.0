/* Pattern called MVC - Model View Controller frame, an approach on structuring 
apps */

/* In this file we will export specific functions that contain the logic for the
campgrounds route. We need to require these functions on that route file */

// Require our campground model:
const Campground = require("../models/campground");
// Require code from Mapbox to then handle longitude and latitude (geocoding instance):
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// Then we need to grab our Mapbox token from our .env file:
const mapBoxToken = process.env.MAPBOX_TOKEN;
// Pass the token into our new mapbox geocoding instance:
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
// Require the cloudinary object:
const { cloudinary } = require("../cloudinary");


// Note that by being a database we need to wait for it to load, using asyncronous functions

// Index function:
module.exports.index = async (req, res) => {
    // Find all the campgrounds:
    const campgrounds = await Campground.find({});
    // Render the file and campgrounds to the file:
    res.render("campgrounds/index", {campgrounds})
}

// Function for rendering the form for a new campground:
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

// Create new campground function:
module.exports.createCampground = async(req, res, next) => {
    // Let's check if there's req.body.campground and if not we throw a new ExpressError:
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400); --> This was just for testing.

    // Use the method forwardGeocode on our geocoding variable:
    const geoData = await geocoder.forwardGeocode({
        // Our query will be whatever location the user inserts when creating a campground
        query: req.body.campground.location,
        // Set up how many location results we want:
        limit: 1
        // Then we have to send the query:
    }).send()
    /* Specifically we need the coordinates of the location. By the Mapbox documentation they
    are in an array called "coordinates" on the "geometry" object of the geoData.body.features */

    // If the data gets validated we create the new campground:
    const campground = new Campground(req.body.campground);
    // Let's asign what we get from "geometry" in campground.geometry:
    campground.geometry = geoData.body.features[0].geometry;
    // Multer creates 2 objects, one with the body info (req.body) and another one with the file(s) (req.files).
    // Let's map those files taking the path and filename and add them to this campground, creating an array called "images":
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    // We can associate a new campground with a logged in user (req.user is automatically added when we log in so we can use its id):
    campground.author = req.user._id;
    // Save it in our database:
    await campground.save();
    console.log(campground);
    // Let's show a flash message if the campground was successfully created:
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}

// Function to show a campground:
module.exports.showCampground = async (req, res) => {
    // Note how we populate a specific campground with its reviews and author:
    const campground = await Campground.findById(req.params.id).populate({
        // And we populate the author of each review:
        path:"reviews",
        populate: {
            path:"author"
        }
    }).populate("author");
    // Let's create a flash error message in case we try to access a non-existent campground:
    if(!campground){
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    // If the campground exists, then show it:
    res.render("campgrounds/show", {campground})
}

// Edit campground function:
module.exports.renderEditForm = async (req, res) => {
    // We destructure the id from req.params:
    const {id} = req.params;
    // Let's find a campground with that id:
    const campground = await Campground.findById(id)
    // Let's create a flash error message in case we try to edit a nonexistent campground:
    if(!campground){
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    
    // If the campground exists and the author is the currentUser, we render the edit form:
    res.render("campgrounds/edit", {campground})
}

// Update campground function:
module.exports.updateCampground = async (req, res) => {
    // We destructure the id from req.params:
    const {id} = req.params;
    console.log(req.body);
    // We update our Campground with that id, using the spread operator to send the query:
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    /* To add images we will first create a new images array (by mapping req.files) and
    then we use the spread operator to push those values into the previous array: */
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    // Then we save the campground, with those new images:
    await campground.save();
    /* If some images were deleted on the update, we need to $pull those elements from the
    images array. Those images will have their filename $in the deleteImages array (created when
    we remove images on the Edit page). Also, we only run the code if there are images to delete: */
    if(req.body.deleteImages) {
        // For each filename we need to call the cloudinary method destroy:
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // Then we update the images array:
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        /*  Again, this means "pull from the images array all images where filename of that
        image is in the req.body.deleteImages array". */
    }
    
    // Let's show a flash message if the campground was successfully updated:
    req.flash("success", "Successfully updated campground!");
    // And redirect to the campground page:
    res.redirect(`/campgrounds/${campground._id}`)
}

// Delete campground function:
module.exports.deleteCampground = async (req, res) => {
    // We destructure the id from req.params:
    const {id} = req.params;
    // And then delete the campground with that id:
    await Campground.findByIdAndDelete(id);
    // Let's show a flash message if the campground was successfully deleted and redirect:
    req.flash("success", "Successfully deleted campground")
    res.redirect("/campgrounds");
}
