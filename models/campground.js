const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

//do not put quotes around CampgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);

