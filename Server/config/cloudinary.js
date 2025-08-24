//IMPORT CLOUDINARY LIBRARY
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const{CloudinaryStorage} = require('multer-storage-cloudinary');

//CONFIGURE CLOUDINARY WITH OUR ACCOUNT DETAILS
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

//CONFIGURE WHERE AND HOW TO STORE IMAGES
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'WEB-PROJECT/food-posts',
        allowed_formats:['jpg','jpeg','png','gif'],
        transformation:[
            {width:800,height:600,crop:'limit'},
            {quality:'auto'}    
        ]
    }
});

//EXPORT FOR OTHER FILES TO USE
module.exports = {
    cloudinary,
    storage
};
