const commentsRouter = require("express").Router();
const Comments = require("../models/comments");
const Dishes = require("../models/dishes");
const bodyParser = require("body-parser");

commentsRouter.use(bodyParser.json());

commentsRouter
	.route("/dishes/:dishId")
	.get((req, res, next) => {
		Comments.find({ dish: req.params.dishId })
			.sort({ createdAt: 1 })
			.then((comments) => {
				console.log(comments);
			});
	})
	.post((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then(async (dish) => {
				if (!dish) {
					res.statusCode = 404;
					res.contentType = "text/plain";
					res.send("Dish with id" + req.params.dishId + " is not found");
					return next();
				}
				// req.body.author = req.user._id
				Comments.create(req.body)
					.then((comment) => {
						res.statusCode = "200";
						res.contentType = "application/json";
						res.json(comment);
						next();
					})
					.catch((err) => next(err));
				res.send("comment saved");
			})
			.catch((err) => {
				next(err);
			});
	})
	.put((req, res, next) => {
		Comments.findById(req.params.commentId).then((comment) => {
			if (!comment) {
				res.statusCode = 404;
				res.contentType = "application/json";
				res.json({
					msg: "Comment with id " + req.params.commentId + " is not found",
				});
				return next(
					new Error("Comment with id " + req.params.comment + "is not found")
				);
			}
			comment.read = true;
			comment.save().then((result) => {
				res.statusCode = "200";
				res.contentType = "application/json";
				res.json(result);
				next();
			});
		});
	});

commentsRouter.route("/:loungeId").get((req, res, next) => {
	Comments.find({ dishId: req.params.dishId })
		.sort({ createdAt: 1 })
		.then((comments) => {
			console.log(comments);
		});
});

module.exports = commentsRouter;
