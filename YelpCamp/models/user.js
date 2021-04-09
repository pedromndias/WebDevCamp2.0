// In this file we will create our User model

// Require mongoose:
const mongoose = require("mongoose");
// create a variable to shorten mongoose.Schema:
const Schema = mongoose.Schema;
// Require passport-local-mongoose, our authentication middleware for mongoose:
const passportLocalMongoose = require("passport-local-mongoose");

// Let's define our User schema:
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// In the next code we use passport to add other fields to our schema, like username and password:
UserSchema.plugin(passportLocalMongoose);
// plugin() will add a username, hash and salt field to store the username, the hashed password and the salt value.
// Additionally adds some methods to our schema, like authenticate(), serialize(), deserialize(), register() etc.

// We compile our schema and export ou model:
module.exports = mongoose.model("User", UserSchema);