// In this file we define our basic Joi schemas to validate our data. And export them:
const BaseJoi = require("joi");
// Require our package to help avoid XSS attacks:
const sanitizeHtml = require('sanitize-html');

// Use a Joi extension with sanitizeHtml so we help prevent cross scripting:
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                // Let's define what can be allowed (in our case, nothing):
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                // Check if there's a difference between the input and the sanitized output:
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// Let's create a variable Joi which the sanitized version of BaseJoi. It uses the extension coded above:
const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    /* campground is expected to be an object and to exist (required). Note how we use escapeHTML
    which was created above. It will sanitize our text fields: */
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    // and deleteImages should be a valida array so we put inside the filename of the images we want to delete:
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    // We expect our review to have a rating and a text(body):
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML() // We also sanitize the review's text with .escapeHTML()
    }).required()
})