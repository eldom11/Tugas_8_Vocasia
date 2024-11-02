const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/author_image');
    },
    filename: function(req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG and PNG are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });
module.exports = { upload };
