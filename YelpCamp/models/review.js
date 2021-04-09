// In this file we will create a model for a campground's review:
// Then we will store the object ID (for each review) on the campgrounds Schema.


// require mongoose:
const mongoose = require("mongoose");
// create a variable to shorten mongoose.Schema:
const Schema = mongoose.Schema;

// create the Schema
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        // author will refer to the User object:
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// compile the Scheme into a model and export it:
module.exports = mongoose.model("Review", reviewSchema);