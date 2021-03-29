const express = require("express")
const app = express();
// Require our User model:
const User = require("./models/user");
const mongoose = require("mongoose");
// Require our password hashing function package:
const bcrypt = require("bcrypt");
// Require express-session to keep track of users that are logged in in the session:
const session = require("express-session");

// Create a mongoose connection to a new database called "loginDemo".
mongoose.connect('mongodb://localhost:27017/loginDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

// Create a set for our views ejs files:
app.set("view engine", "ejs");
app.set("views", "views");

// The following code allows us to parse the body of requests:
app.use(express.urlencoded({extended: true}));
// This next code creates a secret for our session:
app.use(session({secret: "notagoodsecret"}));

// The next function middleware will help us know if a user is logged in or not:
const requireLogin = (req, res, next) => {
    // If req.session.user_id doesn't exists, we redirect to the login page:
    if (!req.session.user_id) {
        return res.redirect("/login");
    }
    // If it exist, we move on:
    next();
}

// Let's create a home route:
app.get("/", (req, res) => {
    res.send("This is the homepage");
})

// Let's create a route to register a new user, rendering a form from our file "register.ejs"
app.get("/register", (req, res) => {
    res.render("register")
})

// Creating a new user:
app.post("/register", async (req, res) => {
    // Destructuring req.body (this come from the form in register.ejs):
    const { password, username } = req.body;
    // Take those values and store them in our database (note that the password will be hashed in our model before storing):
    const user = new User({ username, password })
    await user.save();
    // If successfully registered, we will store the user._id(from mongodb) in the session:
    req.session.user_id = user._id;
    // Redirect to homepage:
    res.redirect("/")
})

// Let's create a route to allow a user to login. This will show the form from our file "login.ejs":
app.get("/login", (req, res) => {
    res.render("login");
})

// The next route will evaluate if the user data from the form in /login is correct:
app.post("/login", async (req, res) => {
    // Destructuring req.body (this come from the form in login.ejs):
    const {username, password} = req.body;
    //Then we use those variables in our created method findAndValidate:
    const foundUser = await User.findAndValidate(username, password);
    if(foundUser){
        // If successfully logged in, we will store the foundUser._id(from mongodb) in the session:
        req.session.user_id = foundUser._id;
        // And redirect the user to /secret:
        res.redirect("/secret");
    } else {
        res.redirect("/login");
    }

})

// In the next route we will be using Express Session to logout a user:
app.post("/logout", (req, res) => {
    // We will remove the user_id by setting it to null:
    req.session.user_id = null;
    // Note: Another option could be the method destroy(): req.session.destroy()
    // Redirect back to login:
    res.redirect("/login");
})

// The access to this route will be restricted, only logged in user could see our message:
// Note how we use a middleware (requireLogin) to check if the user is logged in.
app.get("/secret", requireLogin, (req, res) => {
    // If logged in, the user will be able to see out Secret Page:
    res.render("secret")
})

// We can try our middleware with another route, by typing "/topsecret" on the browser URL space, before and after login:
app.get("/topsecret", requireLogin, (req, res) => {
    res.send("TOP SECRET")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})