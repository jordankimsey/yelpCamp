const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //we want to store review object id in campground db model
    reviews: [
        {
        type: Schema.Types.ObjectId,
            //referes to review model
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    //if document was found
    if (doc) {
        await Review.deleteMany({
            //deletes all reviews where there id field is in doc.reviews 
            //that was deleted and delete its views array
            _id: {
               $in: doc.reviews
           }
       })
   }
})

//do not put quotes around CampgroundSchema
module.exports = mongoose.model('Campground', CampgroundSchema);

