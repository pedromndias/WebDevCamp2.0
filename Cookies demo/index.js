// In order to run, this app needs "npm init -y" and "i express cookie-parser"

const express = require("express");
const app = express();

// By installing cookie-parser we will be able to parse the cookies installed in the browser:
const cookieParser = require("cookie-parser");
app.use(cookieParser("thisismysecret"));
// The note "thisismysecret" will be used by cookie-parser to sign cookies and verify


app.get("/greet", (req, res) => {
    // Let's parse the cookies intalled in the next route and use them:
    // Destructure and give a default value to name:
    const {name = "No-name"} = req.cookies;
    // Print the name from the cookie installed:
    res.send(`Hey there, ${name}`);
})

// In this next route we create a key-value pair as a cookie:
app.get("/setname", (req, res) => {
    res.cookie("name", "Stevie Chicks");
    res.send("Ok, sent you a cookie");
})
// We can check that cookie by accessing Application-Cookies on the dev tools in the browser.
// Name "name" with Value "Stevie%20Chicks" will appear.


// In the next route we create a signed cookie. It helps verifying the integrity of a value
app.get("/getsignedcookie", (req, res) => {
    res.cookie("fruit", "grape", { signed: true });
    res.send("OK, signed your cookie");
})

// Now in this route we will verify the integrity of the cookie:
app.get("/verifyfruit", (req, res) => {
    console.log(req.signedCookies);
    res.send(req.signedCookies);
})


app.listen(3000, () => {
    console.log("Listening on port 3000");
})