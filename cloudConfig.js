const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//additional code to configure. Not present in the npm package description but is there in the cloudinary documentation.
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ['png', 'jpg', 'jpeg'], // supports promises as well
    },
});

module.exports = {
    cloudinary,
    storage,
}