/* This file is self-contained, we run it to seed our database. We loop through
the other 2 seed files "cities" and "seedHelpers" and create a campground database*/

// Remember to run "node seeds/index.js" on the console to create the campgrounds in the database

// Connect to mongoose and use our model:
const mongoose = require("mongoose");
const Campground = require("../models/campground"); // Notice "../" to look for the file outside the seeds folder
// Import from cities.js file:
const cities = require("./cities");
// Import from seedHelpers.js file:
const { places, descriptors } = require("./seedHelpers");

// Mongoose connection with the "yelp-camp" database:
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Create function to get random seedHelper (for the name of the campground):
const sample = array => array[Math.floor(Math.random() * array.length)];

// Let's create a campground database by coding a seedDB function:
const seedDB = async () => {
    // First we delete all the database:
    await Campground.deleteMany({});
    // Then we loop on our cities.js file and create 300 different campgrounds:
    for (let i = 0; i < 300; i++) {
        // Create a random number from 0 to 999 (total of 1000 random cities in cities.js):
        const random1000 = Math.floor(Math.random() * 1000);
        // Now we can use cities[random1000] to get the properties of that random city.
        // For the price we will generate a random number from 10 to 30:
        const price = Math.floor(Math.random() * 20) + 10;
        // And now we gather all the data to create a new Campground:
        const camp = new Campground({
            // Let's set the author of the new Campground as an user we already registered:
            author: "60639fbcf52ddd1d9c71479b",
            // Location's name and title will use our random city cities[random1000]:
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // Some generic description:
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam sequi voluptatem saepe neque in delectus nam deserunt, necessitatibus ut illum? Reiciendis distinctio voluptates eius provident tenetur odit suscipit laudantium velit.",
            // Price will be the variable "price" we just randomly created:
            price,
            // For geometry we will use the longitude and latitude of that random city:
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            // For the seed images we will use some of the images already uploaded to Cloudinary:
            images: [
                {
                  url: 'https://res.cloudinary.com/dm3rusxcr/image/upload/v1617488932/YelpCamp/icnqgkgrduuhtvvghvp8.jpg',
                  filename: 'YelpCamp/icnqgkgrduuhtvvghvp8'
                },
                {
                  url: 'https://res.cloudinary.com/dm3rusxcr/image/upload/v1617488932/YelpCamp/rxbim2bacmgwz9x0m7ep.jpg',
                  filename: 'YelpCamp/rxbim2bacmgwz9x0m7ep'
                }
              ]
        })
        // Finally, we save the new camground:
        await camp.save();
    }
}
// The above process will repeat 50 times when we execute seedDB(). Then, we close the connection:
seedDB().then(() => {
    mongoose.connection.close();
})