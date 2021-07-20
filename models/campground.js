const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    //we want to store review object id in campground db model
    reviews: [
        {
        type: Schema.Types.ObjectId,
            //referes to review model
            ref: 'Review'
        }
    ]
});

//do not put quotes around CampgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);

