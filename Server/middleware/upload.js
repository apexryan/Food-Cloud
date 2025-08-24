const multer = require('multer');
const {storage} = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits:{
        fileSize:5*1024*1024,
        files:5
    },
    fileFilter:(req,file,cb)=>{

        if(file.mimetype.startsWith('image/')){
            cb(null,true);
        }else{
            cb(new Error('Only image files are allowed'),false);
        }
    }

});

module.exports = {

    uploadSingle:upload.single('image'),

    uploadMultiple:upload.array('images',5),

handleUploadError:(err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                error:'File size too large. Maximum 5MB allowed.'
            });
        }
        if(err.code === 'LIMIT_FILE_COUNT'){
            return res.status(400).json({
                error:'Too many files. Maximum 5 images allowed.'
            });
        }
    }
    if(err.message === 'Only image files are allowed'){
        return res.status(400).json({
            error:'Only image files are allowed!'
        });
    }
    next(err);
}
};


