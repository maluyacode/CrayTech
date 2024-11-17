const express = require("express");
const router = express.Router();
const upload = require("../Utils/multer");
const { isAuthenticated } = require("../Middleware/Auth");
const postController = require('../Controllers/PostController');

router.post("/post/create",
    isAuthenticated,
    upload.fields([
        { name: 'videos' },
        { name: 'images' },
    ]),
    postController.create
);

router.put('/post/update/:id',
    isAuthenticated,
    upload.fields([
        { name: 'videos' },
        { name: 'images' },
    ]),
    postController.update
)

router.get("/posts", isAuthenticated, postController.getPosts);

router.put("/upvote/:id", isAuthenticated, upload.none(), postController.upvote);

router.put("/downvote/:id", isAuthenticated, upload.none(), postController.downvote);

router.get('/post/:id', isAuthenticated, postController.getPost);

router.delete('/post/delete/:id', isAuthenticated, postController.delete);

module.exports = router;