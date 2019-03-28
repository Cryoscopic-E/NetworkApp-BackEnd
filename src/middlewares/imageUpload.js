const multer = require('multer');


const imageUpload = multer({
    limits: {
        fileSize: 100000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("File must be jpg, jpeg or png"));
        }
        cb(undefined, true);
    }
})

module.exports = {
    imageUpload
}