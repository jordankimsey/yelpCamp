const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dupnoeem7/image/upload/v1630700534/YelpCamp/mqaelbrtvydyrxrsd5kt.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
});

//this allows us to have thumbnails
//virtual allows us not to store this on database because this infor
//is already direved from information we already are storing
ImageSchema.virtual('thumbnail').get(function () {
    //refers to the particular image that we are on
    //replaces the /upload section of url with certain width of 
    //image which comes from cloudinary api
    return this.url.replace('/upload', '/upload/w_200,h_200');
});

//mongo does not let virtuals be added to object but must pass in the option to be included
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,20)}...</p>`
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

