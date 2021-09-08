//this file runs on it's own seperate from app
//this file allows us to seed data to databasse to build app
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//logic to check for error in connecting monodb
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once("open", () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //Your user ID
            author: '61290152bab2d9774ff01d04',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus adipisci repudiandae necessitatibus a esse sunt incidunt, error, aut accusantium, dolores et similique numquam quos dignissimos! Quod dolores quibusdam facilis exercitationem!',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dupnoeem7/image/upload/v1630884628/YelpCamp/hwjehisqedyqnwwakjki.jpg',
                  filename: 'YelpCamp/hwjehisqedyqnwwakjki'
                },
                {
                  url: 'https://res.cloudinary.com/dupnoeem7/image/upload/v1630884628/YelpCamp/gqi9aebsozbiuhnrp0kq.jpg',
                  filename: 'YelpCamp/gqi9aebsozbiuhnrp0kq'
                }
              ],
            
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})