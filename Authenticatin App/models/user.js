// First, require mongoose:
const mongoose = require("mongoose");
// And bcrypt for our statics method:
const bcrypt = require("bcrypt");

// Second, create a User schema:
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be blank"]
    },
    password: {
        type: String,
        required: [true, "Password cannot be blank"]
    }
})

// We will use .statics to define methods to our schema.
// The next method will find a user and validate its authentication:
userSchema.statics.findAndValidate = async function(username, password) {
    // First we find the user:
    const foundUser = await this.findOne({ username });
    // Then we validate using bcrypt. It will compare the password it pass in with the hashpassword store in the user. It returns a boolean:
    const isValid = await bcrypt.compare(password, foundUser.password);
    // If isValid is true we return the foundUser's object, else we return false:
    return isValid ? foundUser : false;
}

// The next middleware will run some code before (pre) saving the user on the datebase:
userSchema.pre("save", async function(next){
    // We only want to hast the password in case it is being created or modified, not the username or other fields:
    if(!this.isModified("password")) return next();
    // If the user's password is new or modified, we will set it as the hashed password from bcrypt, salt=12:
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

// Third, compile the schema and export:
module.exports = mongoose.model("User", userSchema);
