const express = require("express");
const router = express.Router();

const commentController = require('../Controllers/CommentController');
const { isAuthenticated } = require("../Middleware/Auth");
const upload = require("../Utils/multer");

router.post('/comment/create', upload.none(''), isAuthenticated, commentController.createComment);

router.post('/comment/upvote/:id', isAuthenticated, commentController.upvoteComment)
router.post('/comment/downvote/:id', isAuthenticated, commentController.downvoteComment)

module.exports = router