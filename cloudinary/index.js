const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    //suppose to be in env file
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});

const storage = new CloudinaryStorage({
    //sets up instance of cloudinary storage in file
    //need to pass in object we just confifured
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}