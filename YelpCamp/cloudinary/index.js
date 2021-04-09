// In this file we configure Cloudinary for uploading files into it

// Require cloudinary and multer-storage-cloudinary:
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Set the config, it will associate our Cloudinary account:
cloudinary.config({
    // These 3 values are from our .env file
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// Instantiate (represent) an instance of Cloudinary:
const storage = new CloudinaryStorage({
    // pass the cloudinary object configured:
    cloudinary,
    // Specify the params object:
    params: {
        // Folder where to store things in:
        folder: "YelpCamp",
        // Allowed formats:
        allowedFormats: ["jpeg", "png", "jpg"]
    }

});

// Export the cloudinary instance we just configured and our storage object:
module.exports = {
    cloudinary,
    storage
}