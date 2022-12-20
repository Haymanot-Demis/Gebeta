const express = require('express');
const loungeRouter = express.Router();
const { verifyAdmin, isAuthenticated } = require('../authenticate/authenticate');
const Lounges = require('../models/lounges');
const multer = require('multer');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/loungeImages')
    },
    filename: (req, file, cb) => {
        const extname = file.originalname.split('.')[1]
        const filename = file.originalname.split('.')[0] + crypto.randomBytes(5).toString('hex');
        console.log(extname,filename);
        cb(null, filename + '.' + extname)
    }
});

const upload = multer({
    storage:storage,
    fileFilter : (req, file,cb) => {
        console.log("filename", file);
        if(!file.originalname){
            console.log("no file is uploaded");
            return cb(new Error("no file is uploaded"));
        }
        console.log(file.originalname.match(/\.(jpg|jpeg|png|gif)$/));
        if(!(file.originalname.match(/\.(jpg|jpeg|png|gif)$/))){
            console.log("Image file format must be .jpg . jpeg .gif .png");
            return cb(new Error("Image file format must be .jpg . jpeg .gif .png"));
        }
        return cb(null, true)
    }
})

loungeRouter.use(bodyParser.json());
loungeRouter.use(bodyParser.urlencoded({extended:false}));

loungeRouter.route('/')
.get((req, res, next) =>{
    Lounges.find({})
    .then(lounges => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounges);
        next()
    })
    .catch(err => next(err))
})
.post(isAuthenticated, verifyAdmin,upload.single('image'), (req, res, next) => {
    console.log(req.file);
    Lounges.create({image:req.file.filename, ...req.body})
    .then(lounges => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounges);
        next()
    }, (err) => {
        console.log("err msg ",err.message);
    })
    .catch(err => next(err))
})
.put(verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
    next()
})
.delete(verifyAdmin, (req, res, next) => {
    Lounges.deleteMany({})
    .then(result => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(result);
        next()
    })
    .catch(err => next(err))
});

loungeRouter.route('/:id')
.get((req, res, next) => {
    Lounges.find(req.params.id)
    .then(lounge => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounge);
        next()
    })
})
.post(verifyAdmin, (req, res, next) => {
    Lounges.create(req.body)
    .then(lounges => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounges);
        next()
    })
    .catch(err => next(err))
})
.put(verifyAdmin,(req, res, next) => {
    Lounges.findByIdAndUpdate(req.params.id,
        {
            $set: req.body
        },{new:true}
    ).then(lounge => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(lounge);
        next()
    })
    .catch(err => next(err))

})
.delete(verifyAdmin, (req, res, next) => {
    Lounges.deleteOne({_id:req.params.id})
    .then(result => {
        res.statusCode = 200;
        res.contentType = "application/json";
        res.json(result);
        next()
    })
    .catch(err => next(err))
})

module.exports = loungeRouter;