const express = require("express");
const dishRouter = express.Router();
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");
const {
  verifyAdmin,
  isAuthenticated,
  verifyLoungeAdmin,
} = require("../authenticate/authenticate");
const Orders = require("../models/orders");
const multer = require("multer");
const crypto = require("crypto");
const Lounges = require("../models/lounges");
const { ObjectId } = require("mongodb");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/loungeImages");
  },
  filename: (req, file, cb) => {
    const extname = file.originalname.split(".")[1];
    const filename =
      file.originalname.split(".")[0] + crypto.randomBytes(5).toString("hex");
    console.log(extname, filename);
    cb(null, filename + "." + extname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("filename", file);
    if (!file.originalname) {
      console.log("no file is uploaded");
      return cb(new Error("no file is uploaded"));
    }
    console.log(file.originalname.match(/\.(jpg|jpeg|png|gif|gfif)$/));
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/)) {
      console.log("Image file format must be .jpg . jpeg .gif .png");
      return cb(new Error("Image file format must be .jpg . jpeg .gif .png"));
    }
    return cb(null, true);
  },
});

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get(async (req, res, next) => {
    console.log(req.body);
    let options = {};
    if (req?.user?.loungeAdmin) {
      lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
      options = {
        lounge: lounge._id,
      };
    }
    Dishes.find(options)
      .populate("lounge")
      .populate("lounge.loungeAdmin")
      .then((dishes) => {
        res.statusCode = 200;
        res.contentType("application/json");
        res.json(dishes);
        next();
      })
      .catch((err) => next(err));
  })
  .post(
    isAuthenticated,
    verifyLoungeAdmin,
    upload.single("image"),
    async (req, res, next) => {
      console.log(req.body);
      lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
      req.body.lounge = lounge._id;
      Dishes.create({ image: req?.file?.filename, ...req.body })
        .then((dishes) => {
          res.statusCode = 200;
          res.contentType("application/json");
          res.json(dishes);
          next();
        })
        .catch((err) => next(err));
    }
  )
  .put(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
    next();
  })
  .delete(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
    lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
    Dishes.deleteMany({ lounge: lounge._id })
      .then((result) => {
        res.statusCode = 200;
        res.contentType("application/json");
        res.json(result);
        next();
      })
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishid")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishid)
      .populate("lounge")
      .then((dishes) => {
        res.statusCode = 200;
        res.contentType("application/json");
        res.json(dishes);
      })
      .catch((err) => next(err));
  })
  .post(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes ${req.params.dishid}`);
    next();
  })
  .put(isAuthenticated, verifyLoungeAdmin, async (req, res, next) => {
    lounge = await Lounges.findOne({ loungeAdmin: req.user._id });
    Dishes.findOneAndUpdate(
      { lounge: lounge._id, _id: req.params.dishid },
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
      }
    )
      .then((newDishes) => {
        res.statusCode = 200;
        res.contentType("application/json");
        res.json(newDishes);
      })
      .catch((err) => next(err));
  })
  .delete(isAuthenticated, verifyLoungeAdmin, (req, res, next) => {
    Dishes.deleteOne({ loungeAdmin: req.user._id, _id: req.params.dishid })
      .then((dishes) => {
        res.statusCode = 200;
        res.contentType("application/json");
        res.json(dishes);
      })
      .catch((err) => next(err));
  });

// dishes of a lounge
dishRouter.route("/lounge/:loungeId").get((req, res, next) => {
  Dishes.find({ availableIn: { $in: [ObjectId(req.params.loungeId)] } })
    .then((dishes) => {
      res.statusCode = 200;
      res.contentType("application/json");
      res.json(dishes);
      next();
    })
    .catch((err) => next(err));
});

module.exports = dishRouter;
