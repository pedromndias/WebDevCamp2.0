// in this file we create our Mongoose Model for the different campgrounds

// require mongoose:
const mongoose = require("mongoose");
// require the Review mode:
const Review = require('./review');
// create a variable to shorten mongoose.Schema:
const Schema = mongoose.Schema;

// For the campgrounds images we will be nesting schemas. Images will have its own schema:
const ImageSchema = new Schema({
    // Each image will be an object with url and filename from Cloudinary:
        url: String,
        filename: String
})
/* This is what a Cloudinary image url looks like:
https://res.cloudinary.com/dm3rusxcr/image/upload/w_200/v1617488428/YelpCamp/fizv0xwc2ewxshghopip.jpg */
// Now we will use Mongoose virtuals to set up a thumbnail on every image:
ImageSchema.virtual("thumbnail").get(function() {
    // Let's access the url of an image(this) and replace /upload with /upload/w_200:
    return this.url.replace("/upload", "/upload/w_200");
    /* Now everytime we call img.thumbnail on edit.js, mongoose will take the stored 
    image url and do this replacement, which sets the width of an image to 200px. */
})

// The following code helps Mongoose to include virtuals when we convert a document to JSON:
const opts = { toJSON: { virtuals: true}}

// Then the campground Schema and we nest ImageSchema inside:
const CampgroundSchema = new Schema({
    title: String,
    // For the images it will be an array of images:
    images: [ImageSchema],
    // We will use GeoJSON to work with coordinates:
    geometry: {
        type: {
            // "type" is always the string "Point":
            "type": String,
            enum: ["Point"], // this means "Point" is the only option.
            required: true
        },
        // "coordinates" is an array of 2 numbers:
        "coordinates": {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    // We will associate each created campground with an author (reference to a User):
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // the next property is an array of reviews, refering to the Review Model:
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: "Review"
        }
    ]
}, opts); // Note the "opts", to run virtuals when the document is converted to JSON.

/* Let's also define a Mongoose virtuals to set up the popup that displays when clicking a marker on the map.
Note that Mapbox needs a "properties" object to handle popups */
CampgroundSchema.virtual("properties.popUpMarker").get(function() {
    // Let's return the popup text, with the name and link to the correspondant campground:
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
    // Note that "this" refers to the campground instance.
});

// This next middleware function is used to delete a specific campground:
// Note that the method ("findOneAndDelete") must be the same as in the app.delete route.
CampgroundSchema.post("findOneAndDelete", async function (doc) {
    // Since it is a post function, we have access to what was deleted.
    if(doc){
        // We can then get the id's of the reviews of that campground and delete those as well.
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Compile the model and export it:
module.exports = mongoose.model("Campground", CampgroundSchema);